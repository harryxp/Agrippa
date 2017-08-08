{-# LANGUAGE OverloadedStrings #-}
module Main where

import Data.Aeson (FromJSON, Object, Result(..), Value, decode, fromJSON)
import Data.String (fromString)
import Data.Text.Lazy (Text, pack, unpack)
import Network.Wai.Handler.Warp (defaultSettings, setHost, setPort)
import System.Directory (getHomeDirectory)
import System.Exit (exitFailure)
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
      keyword <- param "key" :: ActionM Text
      result <- (liftAndCatchIO . locate) keyword
      text result

    post "/agrippa/app-launcher/" $ do
      cmd <- param "cmd" :: ActionM Text
      app <- param "app" :: ActionM Text
      result <- (liftAndCatchIO . launch cmd) app
      text result

locate :: Text -> IO Text
locate keyword = pack <$> readProcess "locate" [unpack keyword] ""

launch :: Text -> Text -> IO Text
launch cmd app = pack <$> readProcess (unpack cmd) [unpack app] ""
