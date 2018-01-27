{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Main (main) where

import Data.Aeson (Object, decode)
import Data.String (fromString)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Exit (exitFailure)
import System.FilePath ((</>))
import System.IO (hPutStrLn, stderr)
import Web.Scotty (Options(..), file, get, json, scottyOpts)

import qualified Data.ByteString.Lazy as B (readFile)
import qualified Data.HashMap.Lazy    as M (HashMap)
import qualified Data.Text.Lazy       as T (Text)

import Agrippa.Utils (getConfigDir, lookupJSON)
import Agrippa.Plugins.FileSystem.IndexBuilder (buildSearchIndices)

import qualified Agrippa.Plugins.FileSystem.ExecutableSearch as EXS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.LinuxFileSearch  as LFS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.MacAppSearch     as MAS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.MacFileSearch    as MFS (registerHandlers)

data ScottyConfig = ScottyConfig { host :: String
                                 , port :: Int
                                 }
                                 deriving Show

main :: IO ()
main = do
  config <- readAgrippaConfig
  case config of
    Nothing       -> hPutStrLn stderr "Failed to parse Agrippa config." >>
                     hPutStrLn stderr "Please check .agrippa under your home directory." >>
                     exitFailure
    Just (sc,ac)  -> do
      taskNameToIndex <- buildSearchIndices ac
      startScotty (buildScottyOpts sc) ac taskNameToIndex

readAgrippaConfig :: IO (Maybe (ScottyConfig, Object))
readAgrippaConfig = do
  configDir <- getConfigDir
  configStr <- B.readFile (configDir </> "config.json")
  return $ do
    agrippaConfig <- decode configStr                       :: Maybe Object
    prefs         <- lookupJSON "preferences" agrippaConfig :: Maybe Object
    host          <- lookupJSON "host"        prefs         :: Maybe String
    port          <- lookupJSON "port"        prefs         :: Maybe Int
    Just (ScottyConfig {host = host, port = port}, agrippaConfig)

buildScottyOpts :: ScottyConfig -> Options
buildScottyOpts (ScottyConfig { host = h, port = p }) =
  Options { verbose  = 1
          , settings = setPort p (setHost (fromString h) defaultSettings)
          }

startScotty :: Options -> Object -> M.HashMap String [T.Text] -> IO ()
startScotty opts agrippaConfig taskNameToIndex =
  scottyOpts opts $ do
    get "/agrippa/" $ do
      file "web/index.html"

    get "/agrippa/js/scripts.js" $ do
      file "web/js/scripts.js"

    -- serve the config to frontend
    get "/agrippa/config" $ do
      json agrippaConfig

    EXS.registerHandlers taskNameToIndex "/agrippa/executable/suggest" "/agrippa/executable/launch"
    LFS.registerHandlers taskNameToIndex "/agrippa/linux-file/suggest" "/agrippa/linux-file/open"
    MAS.registerHandlers taskNameToIndex "/agrippa/mac-app/suggest"    "/agrippa/mac-app/launch"
    MFS.registerHandlers taskNameToIndex "/agrippa/mac-file/suggest"   "/agrippa/mac-file/open"

