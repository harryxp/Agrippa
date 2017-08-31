{-# LANGUAGE OverloadedStrings #-}
module Main where

import Data.Aeson (FromJSON, Object, Result(..), decode, fromJSON)
import Data.Char (toLower)
import Data.List (intercalate, isInfixOf)
import Data.List.Split (splitOn)
import Data.String (fromString)
import Data.Text.Lazy (Text, pack)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Directory (getHomeDirectory)
import System.Exit (exitFailure)
import System.FilePath.Find (FileType(Directory, RegularFile, SymbolicLink), FindClause, always, extension, fileName, fileType, find, (==?), (/=?), (&&?), (||?))
import System.FilePath.Posix ((</>))
import System.IO (hPutStrLn, stderr)
import System.Process (readProcess)
import Web.Scotty (ActionM, Options(..), file, get, liftAndCatchIO, param, post, raw, scottyOpts, text)

import qualified Data.ByteString.Lazy as B (ByteString, readFile)
import qualified Data.HashMap.Lazy    as M (lookup)
import qualified Data.Text            as T (Text)

data Config = Config { host :: String
                     , port :: Int
                     }
                     deriving Show

main :: IO ()
main = do
  agrippaConfigStr <- readAgrippaConfigFile
  case parseAgrippaConfig agrippaConfigStr of
    Nothing -> hPutStrLn stderr "Failed to parse Agrippa config." >>
               hPutStrLn stderr "Please check .agrippa under your home directory." >>
               exitFailure
    Just c  -> startScotty (buildScottyOpts c) agrippaConfigStr

readAgrippaConfigFile :: IO B.ByteString
readAgrippaConfigFile = do
  homeDir <- getHomeDirectory
  B.readFile (homeDir </> ".agrippa")

parseAgrippaConfig :: B.ByteString -> Maybe Config
parseAgrippaConfig configStr = do
  config   <- decode configStr                :: Maybe Object
  prefs    <- lookupJSON "preferences" config :: Maybe Object
  host     <- lookupJSON "host" prefs         :: Maybe String
  port     <- lookupJSON "port" prefs         :: Maybe Int
  Just (Config {host = host, port = port})
  where
  lookupJSON :: FromJSON a => T.Text -> Object -> Maybe a
  lookupJSON key m = do
    jValue <- M.lookup key m
    result <- return (fromJSON jValue)
    case result of
      Error e   -> Nothing
      Success v -> Just v

buildScottyOpts :: Config -> Options
buildScottyOpts (Config { host = h, port = p }) =
  Options { verbose = 1
          , settings = setPort p (setHost (fromString h) defaultSettings)
          }

startScotty :: Options -> B.ByteString -> IO ()
startScotty opts agrippaConfigStr =
  scottyOpts opts $ do
    get "/agrippa/" $ do
      file "web/index.html"

    get "/agrippa/config" $ do
      raw agrippaConfigStr

    get "/agrippa/js/scripts.js" $ do
      file "web/js/scripts.js"

    get "/agrippa/file-search/:key" $ do
      keyword <- param "key" :: ActionM String
      result  <- liftAndCatchIO (locate keyword)
      text (pack result)

    post "/agrippa/launch-exec-suggestion/" $ do
      term      <- param "term"  :: ActionM String
      rootPaths <- param "paths" :: ActionM String
      execs     <- (liftAndCatchIO . suggestExecs term . splitOn " ") rootPaths
      (text . pack . intercalate "\n") execs

    post "/agrippa/launch-exec" $ do
      app    <- param "app"  :: ActionM String
      result <- liftAndCatchIO (launchExec app)
      text (pack result)

    post "/agrippa/launch-mac-suggestion/" $ do
      term      <- param "term"  :: ActionM String
      rootPaths <- param "paths" :: ActionM String
      apps      <- (liftAndCatchIO . suggestMacApps term . splitOn " ") rootPaths
      (text . pack . intercalate "\n") apps

    post "/agrippa/launch-mac" $ do
      app    <- param "app"  :: ActionM String
      result <- liftAndCatchIO (launchMacApp app)
      text (pack result)

locate :: String -> IO String
locate keyword = readProcess "locate" [keyword] []

suggestExecs :: String -> [FilePath] -> IO [FilePath]
suggestExecs term rootPaths =
  let recursionPred = always
      filterPred    = fileNameContains term &&?
                      (fileType ==? RegularFile ||? fileType ==? SymbolicLink)
  in concat <$> mapM (find recursionPred filterPred) rootPaths

launchExec :: String -> IO String
launchExec app = readProcess app [] []

suggestMacApps :: String -> [FilePath] -> IO [FilePath]
suggestMacApps term rootPaths =
  let recursionPred = extension /=? ".app"
      filterPred    = fileNameContains term &&?
                      fileType ==? Directory &&?
                      extension ==? ".app"
  in concat <$> mapM (find recursionPred filterPred) rootPaths

fileNameContains :: String -> FindClause Bool
fileNameContains term = (isInfixOf (toLowerStr term) . toLowerStr) <$> fileName

launchMacApp :: String -> IO String
launchMacApp app = readProcess "open" ["-a", app] []

toLowerStr :: String -> String
toLowerStr = fmap toLower
