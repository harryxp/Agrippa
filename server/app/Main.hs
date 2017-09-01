{-# LANGUAGE OverloadedStrings #-}
module Main where

import Data.Aeson (FromJSON, Object, Result(..), decode, fromJSON)
import Data.Char (toLower)
import Data.List (isInfixOf)
import Data.List.Split (splitOn)
import Data.String (fromString)
import Data.Text.Lazy (Text, pack)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Directory (getHomeDirectory)
import System.Exit (exitFailure)
import System.FilePath.Find (FileType(Directory, RegularFile, SymbolicLink), FindClause, always, extension, fileName, fileType, find, (==?), (/=?), (&&?), (||?))
import System.FilePath.Posix ((</>))
import System.IO (hPutStrLn, stderr)
import System.Process (callCommand, callProcess, readProcess)
import Web.Scotty (ActionM, Options(..), file, get, json, jsonData, liftAndCatchIO, param, post, scottyOpts, text)

import qualified Data.ByteString.Lazy as B (ByteString, readFile)
import qualified Data.HashMap.Lazy    as M (lookup)
import qualified Data.Text            as T (Text)

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
  homeDir <- getHomeDirectory
  B.readFile (homeDir </> ".agrippa")

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

    -- FileSearch plugin
    get "/agrippa/file-search/:key" $ do
      keyword <- param "key" :: ActionM String
      result  <- liftAndCatchIO (locate keyword)
      text (pack result)

    -- ExecutableLauncher plugin
    post "/agrippa/launch-exec-suggestion/" (suggestUsingFileSystem findExecs)

    post "/agrippa/launch-exec" $ do
      app <- param "app" :: ActionM String
      (liftAndCatchIO . launchExec) app
      (text . pack) ("Launched " ++ app ++ ".")

    -- MacAppLauncher plugin
    post "/agrippa/launch-mac-suggestion/" (suggestUsingFileSystem findMacApps)

    post "/agrippa/launch-mac" $ do
      app <- param "app" :: ActionM String
      (liftAndCatchIO . launchMacApp) app
      (text . pack) ("Launched " ++ app ++ ".")

suggestUsingFileSystem :: (String -> [FilePath] -> IO [FilePath]) -> ActionM ()
suggestUsingFileSystem findItems = do
  o <- jsonData :: ActionM Object
  let maybeItems = do
        term      <- lookupJSON "term"  o :: Maybe String
        rootPaths <- lookupJSON "paths" o :: Maybe [String]
        (Just . liftAndCatchIO . findItems term) rootPaths
  case maybeItems of
    Just items -> items >>= json
    Nothing    -> json ([] :: [String])

locate :: String -> IO String
locate keyword = readProcess "locate" [keyword] []

-- ExecutableLauncher plugin
findExecs :: String -> [FilePath] -> IO [FilePath]
findExecs term rootPaths =
  let recursionPred = always
      filterPred    = fileNameContains term &&?
                      (fileType ==? RegularFile ||? fileType ==? SymbolicLink)
  in concat <$> mapM (find recursionPred filterPred) rootPaths

launchExec :: String -> IO ()
launchExec app = callCommand app

-- MacAppLauncher plugin
findMacApps :: String -> [FilePath] -> IO [FilePath]
findMacApps term rootPaths =
  let recursionPred = extension /=? ".app"
      filterPred    = fileNameContains term &&?
                      fileType ==? Directory &&?
                      extension ==? ".app"
  in concat <$> mapM (find recursionPred filterPred) rootPaths

launchMacApp :: String -> IO ()
launchMacApp app = callProcess "open" ["-a", app]

-- helper functions
fileNameContains :: String -> FindClause Bool
fileNameContains term = (isInfixOf (toLowerStr term) . toLowerStr) <$> fileName

toLowerStr :: String -> String
toLowerStr = fmap toLower

lookupJSON :: FromJSON a => T.Text -> Object -> Maybe a
lookupJSON key m = do
  jValue <- M.lookup key m
  result <- return (fromJSON jValue)
  case result of
    Error e   -> Nothing
    Success v -> Just v
