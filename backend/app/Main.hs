{-# LANGUAGE OverloadedStrings #-}
module Main where

import Data.Text.Lazy (Text, pack, unpack)
import Network.Wai.Handler.Warp (defaultSettings, setHost)
import System.Process (readProcess)
import Web.Scotty (ActionM, Options(..), file, get, liftAndCatchIO, param, scottyOpts, text)

main :: IO ()
main = scottyOpts opts $ do
  get "/agrippa/" $ do
    file "web/index.html"

  get "/agrippa/config" $ do
    file "agrippa-config.json"

  get "/agrippa/js/scripts.js" $ do
    file "web/js/scripts.js"

  get "/agrippa/file-search/:word" $ do
    keyword <- param "word" :: ActionM Text
    result <- (liftAndCatchIO . locate) keyword
    text result

  get "/agrippa/app-launcher/:word" $ do
    app <- param "word" :: ActionM Text
    result <- (liftAndCatchIO . launch) app
    text result

opts :: Options
opts = Options { verbose = 1
               , settings = setHost "127.0.0.1" defaultSettings
               }

locate :: Text -> IO Text
locate keyword = pack <$> readProcess "locate" [unpack keyword] ""

launch :: Text -> IO Text
launch app = pack <$> readProcess (unpack app) [] ""
