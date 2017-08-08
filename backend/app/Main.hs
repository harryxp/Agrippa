{-# LANGUAGE OverloadedStrings #-}
module Main where

import Data.Text.Lazy (Text, pack, unpack)
import Network.Wai.Handler.Warp (defaultSettings, setHost)
import System.Process (readProcess)
import Web.Scotty (ActionM, Options(..), file, get, liftAndCatchIO, param, post, scottyOpts, text)

main :: IO ()
main = scottyOpts opts $ do
  get "/agrippa/" $ do
    file "web/index.html"

  get "/agrippa/config" $ do
    file "agrippa-config.json"

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

opts :: Options
opts = Options { verbose = 1
               , settings = setHost "127.0.0.1" defaultSettings
               }

locate :: Text -> IO Text
locate keyword = pack <$> readProcess "locate" [unpack keyword] ""

launch :: Text -> Text -> IO Text
launch cmd app = pack <$> readProcess (unpack cmd) [unpack app] ""
