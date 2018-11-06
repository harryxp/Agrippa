module Agrippa.Main (agrippadDriver) where

import Control.Concurrent.Async (async, cancel)
import Control.Concurrent.MVar (MVar, newEmptyMVar, putMVar, takeMVar)
import Control.Monad (forever)
import Data.Either.Extra (eitherToMaybe)
import Data.IORef (IORef, newIORef)
import Data.String (fromString)
import Data.Yaml (Object, ParseException, decodeFileEither)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Exit (exitFailure)
import System.FilePath ((</>))
import System.IO (hPutStrLn, stderr)
import Web.Scotty (Options(Options), addHeader, file, get, json, liftAndCatchIO, settings, scottyOpts, verbose)

import qualified Data.HashMap.Lazy    as M (HashMap)
import qualified Data.Text.Lazy       as T (Text)

import Agrippa.Plugins.FileSystem.IndexBuilder (buildSearchIndices)
import Agrippa.Utils (getConfigDir, lookupJSON)

import qualified Agrippa.Plugins.FileSystem.LinuxFileSearch      as LFS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.MacAppSearch         as MAS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.MacFileSearch        as MFS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.UnixExecutableSearch as UES (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.WinExecutableSearch  as WES (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.WinFileSearch        as WFS (registerHandlers)
import qualified Agrippa.Plugins.KeePass1                        as K   (registerHandlers)

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
      keepass1MasterPasswordBox <- newIORef Nothing
      startScotty (buildScottyOpts scottyConfig) agrippaConfig taskNamesToItems mvar keepass1MasterPasswordBox

readAgrippaConfig :: IO (Maybe (ScottyConfig, Object))
readAgrippaConfig = do
  configDir <- getConfigDir
  let configFile = configDir </> "config.yaml"
  putStrLn ("Reading configuration from " ++ configFile ++ ".")
  eitherAgrippaConfig <- decodeFileEither configFile        :: IO (Either ParseException Object)
  return $ do
    agrippaConfig <- eitherToMaybe eitherAgrippaConfig
    prefs         <- lookupJSON "preferences" agrippaConfig :: Maybe Object
    host'         <- lookupJSON "host"        prefs         :: Maybe String
    port'         <- lookupJSON "port"        prefs         :: Maybe Int
    Just (ScottyConfig {host = host', port = port'}, agrippaConfig)

buildScottyOpts :: ScottyConfig -> Options
buildScottyOpts (ScottyConfig { host = h, port = p }) =
  Options { verbose  = 1
          , settings = (setPort p . setHost (fromString h)) defaultSettings
          }

startScotty :: Options -> Object -> M.HashMap String [T.Text] -> MVar () -> IORef (Maybe String) -> IO ()
startScotty scottyConfig agrippaConfig taskNamesToItems mvar keepass1MasterPasswordBox =
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

    LFS.registerHandlers taskNamesToItems "/agrippa/linux-file/suggest"      "/agrippa/linux-file/open"
    MAS.registerHandlers taskNamesToItems "/agrippa/mac-app/suggest"         "/agrippa/mac-app/open"
    MFS.registerHandlers taskNamesToItems "/agrippa/mac-file/suggest"        "/agrippa/mac-file/open"
    UES.registerHandlers taskNamesToItems "/agrippa/unix-executable/suggest" "/agrippa/unix-executable/open"
    WES.registerHandlers taskNamesToItems "/agrippa/win-executable/suggest"  "/agrippa/win-executable/open"
    WFS.registerHandlers taskNamesToItems "/agrippa/win-file/suggest"        "/agrippa/win-file/open"

    K.registerHandlers   agrippaConfig    "/agrippa/keepass1/suggest"        "/agrippa/keepass1/unlock"      keepass1MasterPasswordBox

