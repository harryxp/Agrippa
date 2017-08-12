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
import System.FilePath.Find (always, extension, fileName, find, (==?), (/=?), (&&?))
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

    post "/agrippa/launch/" $ do
      cmd    <- param "cmd"  :: ActionM String
      opts   <- param "opts" :: ActionM String
      app    <- param "app"  :: ActionM String
      result <- liftAndCatchIO (launch cmd (splitOn " " opts ++ [app]))
      text (pack result)

    post "/agrippa/launch-suggestion/" $ do
      app         <- param "app"   :: ActionM String
      ext         <- param "ext"   :: ActionM String
      rootPaths   <- param "paths" :: ActionM String
      launchables <- (liftAndCatchIO . suggestLaunchables app ext . splitOn " ") rootPaths
      (text . pack . intercalate "\n") launchables

locate :: String -> IO String
locate keyword = readProcess "locate" [keyword] []

launch :: String -> [String] -> IO String
launch cmd args = readProcess cmd args []

suggestLaunchables :: String -> String -> [FilePath] -> IO [FilePath]
suggestLaunchables app ext rootPaths =
  let recursionPred = if null ext then always else extension /=? ext
      filterPred    = if null ext
                      then  (isInfixOf (toLowerStr app) . toLowerStr) <$> fileName
                      else ((isInfixOf (toLowerStr app) . toLowerStr) <$> fileName) &&? extension ==? ext
  in concat <$> mapM (find recursionPred filterPred) rootPaths

toLowerStr :: String -> String
toLowerStr = fmap toLower
