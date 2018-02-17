module Agrippa.Main (agrippadDriver) where

import Control.Concurrent.Async (async, cancel)
import Control.Concurrent.MVar (MVar, newEmptyMVar, putMVar, takeMVar)
import Control.Monad (forever)
import Data.Aeson (Object, decode)
import Data.String (fromString)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Exit (exitFailure)
import System.FilePath ((</>))
import System.IO (hPutStrLn, stderr)
import Web.Scotty (Options(Options), addHeader, file, get, json, liftAndCatchIO, settings, scottyOpts, verbose)

import qualified Data.ByteString.Lazy as B (readFile)
import qualified Data.HashMap.Lazy    as M (HashMap)
import qualified Data.Text.Lazy       as T (Text)

import Agrippa.Utils (getConfigDir, lookupJSON)
import Agrippa.Plugins.FileSystem.IndexBuilder (buildSearchIndices)

import qualified Agrippa.Plugins.FileSystem.ExecutableSearch as EXS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.LinuxFileSearch  as LFS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.MacAppSearch     as MAS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.MacFileSearch    as MFS (registerHandlers)
import qualified Agrippa.Plugins.KeePass1                    as K   (registerHandlers)

data ScottyConfig = ScottyConfig { host :: String
                                 , port :: Int
                                 }
                                 deriving Show

agrippadDriver :: IO ()
agrippadDriver = forever $ do
  mvar   <- newEmptyMVar
  thread <- async (agrippadExecutor mvar)
  takeMVar mvar -- this blocks until mvar has value
  cancel thread

agrippadExecutor :: MVar () -> IO ()
agrippadExecutor mvar = do
  config <- readAgrippaConfig
  case config of
    Nothing                            -> do
      hPutStrLn stderr "Failed to parse Agrippa config."
      configDir <- getConfigDir
      hPutStrLn stderr ("Please check " ++ configDir ++ " under your home directory.")
      exitFailure
    Just (scottyConfig, agrippaConfig) -> do
      taskNamesToItems <- buildSearchIndices agrippaConfig
      startScotty (buildScottyOpts scottyConfig) agrippaConfig taskNamesToItems mvar

readAgrippaConfig :: IO (Maybe (ScottyConfig, Object))
readAgrippaConfig = do
  configDir <- getConfigDir
  let configFile = configDir </> "config.json"
  putStrLn ("Reading configuration from " ++ configFile ++ ".")
  configStr <- B.readFile configFile
  return $ do
    agrippaConfig <- decode configStr                       :: Maybe Object
    prefs         <- lookupJSON "preferences" agrippaConfig :: Maybe Object
    host'         <- lookupJSON "host"        prefs         :: Maybe String
    port'         <- lookupJSON "port"        prefs         :: Maybe Int
    Just (ScottyConfig {host = host', port = port'}, agrippaConfig)

buildScottyOpts :: ScottyConfig -> Options
buildScottyOpts (ScottyConfig { host = h, port = p }) =
  Options { verbose  = 1
          , settings = (setPort p . setHost (fromString h)) defaultSettings
          }

startScotty :: Options -> Object -> M.HashMap String [T.Text] -> MVar () -> IO ()
startScotty scottyConfig agrippaConfig taskNamesToItems mvar =
  scottyOpts scottyConfig $ do
    get "/agrippa/" $ do
      addHeader "Content-Type" "text/html"
      file "web/index.html"

    get "/agrippa/agrippa.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/agrippa.js"

    get "/agrippa/styles.css" $ do
      addHeader "Content-Type" "text/css"
      file "web/styles.css"

    -- serve the config to frontend
    get "/agrippa/config" $ do
      json agrippaConfig

    -- it's tempting to just do `myThreadId >>= killThread` here
    -- however Scotty would catch that so agrippadDriver won't see it
    -- instead we use an MVar to facilitate the communication
    get "/agrippa/restart" $ do
      liftAndCatchIO (putMVar mvar ())

    EXS.registerHandlers taskNamesToItems "/agrippa/executable/suggest" "/agrippa/executable/open"
    LFS.registerHandlers taskNamesToItems "/agrippa/linux-file/suggest" "/agrippa/linux-file/open"
    MAS.registerHandlers taskNamesToItems "/agrippa/mac-app/suggest"    "/agrippa/mac-app/open"
    MFS.registerHandlers taskNamesToItems "/agrippa/mac-file/suggest"   "/agrippa/mac-file/open"

    K.registerHandlers   agrippaConfig    "/agrippa/keepass1/suggest"

