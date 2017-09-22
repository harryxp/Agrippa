{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Main (main) where

import Data.Aeson (Object, decode)
import Data.String (fromString)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Directory (getHomeDirectory)
import System.Exit (exitFailure)
import System.FilePath.Posix ((</>))
import System.IO (hPutStrLn, stderr)
import Web.Scotty (Options(..), file, get, json, scottyOpts)

import qualified Data.ByteString.Lazy as B (ByteString, readFile)

import Agrippa.Utils (lookupJSON)

import qualified Agrippa.Plugins.FileSystem.FileSearch       as FS (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.ExecutableSearch as ES (registerHandlers)
import qualified Agrippa.Plugins.FileSystem.MacAppSearch     as MS (registerHandlers)

data ScottyConfig = ScottyConfig { host :: String
                                 , port :: Int
                                 }
                                 deriving Show

main :: IO ()
main = do
  agrippaConfigStr <- readAgrippaConfigFile
  case parseAgrippaConfig agrippaConfigStr of
    Nothing       -> hPutStrLn stderr "Failed to parse Agrippa config." >>
                     hPutStrLn stderr "Please check .agrippa under your home directory." >>
                     exitFailure
    Just (sc,ac)  -> startScotty (buildScottyOpts sc) ac

readAgrippaConfigFile :: IO B.ByteString
readAgrippaConfigFile = do
  configDir <- getAgrippaConfigDir
  B.readFile (configDir </> "config.json")

getAgrippaConfigDir :: IO FilePath
getAgrippaConfigDir = getHomeDirectory >>= return . (</> ".agrippa.d")

parseAgrippaConfig :: B.ByteString -> Maybe (ScottyConfig, Object)
parseAgrippaConfig configStr = do
  agrippaConfig <- decode configStr                       :: Maybe Object
  prefs         <- lookupJSON "preferences" agrippaConfig :: Maybe Object
  host          <- lookupJSON "host" prefs                :: Maybe String
  port          <- lookupJSON "port" prefs                :: Maybe Int
  Just (ScottyConfig {host = host, port = port}, agrippaConfig)

buildScottyOpts :: ScottyConfig -> Options
buildScottyOpts (ScottyConfig { host = h, port = p }) =
  Options { verbose = 1
          , settings = setPort p (setHost (fromString h) defaultSettings)
          }

startScotty :: Options -> Object -> IO ()
startScotty opts agrippaConfig =
  scottyOpts opts $ do
    get "/agrippa/" $ do
      file "web/index.html"

    get "/agrippa/config" $ do
      json agrippaConfig

    get "/agrippa/js/scripts.js" $ do
      file "web/js/scripts.js"

    FS.registerHandlers "/agrippa/file/suggest"       "/agrippa/file/open"
    ES.registerHandlers "/agrippa/executable/suggest" "/agrippa/executable/launch"
    MS.registerHandlers "/agrippa/mac-app/suggest"    "/agrippa/mac-app/launch"

