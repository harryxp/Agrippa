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

import Agrippa.Utils (getConfigDir, lookupJSON)

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
      configDir <- getConfigDir
      let configFile = configDir </> "config.yaml"
      hPutStrLn stderr ("Failed to parse Agrippa config.  Please check " ++ configFile ++ ".")
      exitFailure
    Just (scottyConfig, agrippaConfig) -> do
      keepass1MasterPasswordBox <- newIORef Nothing
      startScotty (buildScottyOpts scottyConfig) agrippaConfig mvar keepass1MasterPasswordBox

readAgrippaConfig :: IO (Maybe (ScottyConfig, Object))
readAgrippaConfig = do
  configDir <- getConfigDir
  let configFile = configDir </> "config.yaml"
  putStrLn ("Reading configuration from " ++ configFile ++ ".")
  eitherAgrippaConfig <- decodeFileEither configFile    :: IO (Either ParseException Object)
  return $ do
    agrippaConfig <- eitherToMaybe eitherAgrippaConfig  :: Maybe Object
    port'         <- lookupJSON "port" agrippaConfig    :: Maybe Int
    Just (ScottyConfig {host = "127.0.0.1", port = port'}, agrippaConfig)

buildScottyOpts :: ScottyConfig -> Options
buildScottyOpts (ScottyConfig { host = h, port = p }) =
  Options { verbose  = 1
          , settings = (setPort p . setHost (fromString h)) defaultSettings
          }

startScotty :: Options -> Object -> MVar () -> IORef (Maybe String) -> IO ()
startScotty scottyConfig agrippaConfig mvar keepass1MasterPasswordBox =
  scottyOpts scottyConfig $ do
    get "/agrippa/" $ do
      addHeader "Content-Type" "text/html"
      file "web/index.html"

    get "/agrippa/axios.min.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/axios.min.js"

    get "/agrippa/sprintf.min.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/sprintf.min.js"

    get "/agrippa/agrippa-plugin-Clock.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/agrippa-plugin-Clock.js"

    get "/agrippa/agrippa-plugin-KeePass1.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/agrippa-plugin-KeePass1.js"

    get "/agrippa/agrippa-plugin-MortgageCalc.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/agrippa-plugin-MortgageCalc.js"

    get "/agrippa/agrippa-plugin-OnlineSearch.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/agrippa-plugin-OnlineSearch.js"

    get "/agrippa/agrippa-plugin-Snippets.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/agrippa-plugin-Snippets.js"

    get "/agrippa/agrippa-plugin-TaskSearch.js" $ do
      addHeader "Content-Type" "application/javascript"
      file "web/agrippa-plugin-TaskSearch.js"

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

    K.registerHandlers agrippaConfig "/agrippa/keepass1/suggest" "/agrippa/keepass1/unlock" keepass1MasterPasswordBox
