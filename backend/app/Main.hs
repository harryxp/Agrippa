{-# LANGUAGE OverloadedStrings #-}
module Main where

import Data.Text.Lazy (Text, pack, unpack)
import System.Process (readProcess)
import Web.Scotty (ActionM, get, liftAndCatchIO, param, scotty, text)

main :: IO ()
main = scotty 3000 $ do
  get "/agrippa/file-search/:word" $ do
    keyword <- param "word" :: ActionM Text
    result <- (liftAndCatchIO . locate) keyword
    text result

locate :: Text -> IO Text
locate keyword = pack <$> readProcess "locate" [unpack keyword] ""
