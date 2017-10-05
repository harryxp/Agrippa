{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Main (main) where

import Data.Aeson (Object, Value(Object), decode)
import Data.HashMap.Lazy (elems, member)
import Data.List (intercalate)
import Data.String (fromString)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Directory (createDirectoryIfMissing, getHomeDirectory)
import System.Exit (exitFailure)
import System.FilePath.Find (always, find)
import System.FilePath.Posix ((</>))
import System.IO (hPutStrLn, stderr)
import Web.Scotty (Options(..), file, get, json, scottyOpts)

import qualified Data.ByteString.Lazy as B (ByteString, readFile)

import Agrippa.Utils (lookupJSON)

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
    Just (sc,ac)  -> buildSearchIndices ac >> startScotty (buildScottyOpts sc) ac

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

getConfigDir :: IO String
getConfigDir = do
  homeDir <- getHomeDirectory
  return (homeDir </> ".agrippa.d")

buildSearchIndices :: Object -> IO ()
buildSearchIndices agrippaConfig =
  case lookupJSON "tasks" agrippaConfig :: Maybe Object of
    Nothing    -> error "Can't find tasks when building indices."
    Just tasks -> (mapM_ buildSearchIndex . filter hasPaths . elems) tasks

hasPaths :: Value -> Bool
hasPaths (Object o) = member "paths" o
hasPaths _ = False

buildSearchIndex :: Value -> IO ()
buildSearchIndex (Object o) =
  let maybeAction :: Maybe (IO ())
      maybeAction = do
        taskName <- lookupJSON "name"   o :: Maybe String
        plugin   <- lookupJSON "plugin" o :: Maybe String
        paths    <- lookupJSON "paths"  o :: Maybe [String]
        Just (buildSearchIndex' taskName plugin paths)
  in case maybeAction of
      Just action -> action
      Nothing     -> error "Can't find 'name', 'plugin', or 'paths' when building indices."
buildSearchIndex _ = return ()

buildSearchIndex' :: String -> String -> [String] -> IO ()
buildSearchIndex' taskName plugin paths = do
  configDir <- getConfigDir
  let indexDir = configDir </> plugin </> taskName
  createDirectoryIfMissing True indexDir
  files     <- (fmap concat . mapM (find always always)) paths :: IO [String]
  writeFile (indexDir </> "index") (intercalate "\n" files)

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

    get "/agrippa/js/scripts.js" $ do
      file "web/js/scripts.js"

    -- serve the config to frontend
    get "/agrippa/config" $ do
      json agrippaConfig

    EXS.registerHandlers "/agrippa/executable/suggest" "/agrippa/executable/launch"
    LFS.registerHandlers "/agrippa/linux-file/suggest" "/agrippa/linux-file/open"
    MAS.registerHandlers "/agrippa/mac-app/suggest"    "/agrippa/mac-app/launch"
    MFS.registerHandlers "/agrippa/mac-file/suggest"   "/agrippa/mac-file/open"

