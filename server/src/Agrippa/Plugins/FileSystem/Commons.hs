{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.Commons (fileNameContains, registerHandlers) where

import Data.Aeson (Object)
import Data.Char (toLower)
import Data.List (isInfixOf)
import Data.Text.Lazy (pack)
import System.FilePath.Find (FilterPredicate, RecursionPredicate, fileName, find)
import Web.Scotty (ActionM, RoutePattern, ScottyM, json, jsonData, liftAndCatchIO, param, post, text)

import Agrippa.Utils (lookupJSON)

registerHandlers :: RecursionPredicate
                 -> (String -> FilterPredicate)
                 -> (String -> IO ())
                 -> RoutePattern
                 -> RoutePattern
                 -> ScottyM ()
registerHandlers rPred fPred open suggestUrl openUrl = do
  post suggestUrl $ do
    o <- jsonData :: ActionM Object
    let maybeItems = do
          term      <- lookupJSON "term"  o :: Maybe String
          rootPaths <- lookupJSON "paths" o :: Maybe [String]
          (Just . liftAndCatchIO . findWithPreds rPred fPred term) rootPaths
    case maybeItems of
      Just items -> items >>= json . take 40
      Nothing    -> json ([] :: [String])

  post openUrl $ do
    item <- param "item" :: ActionM String
    (liftAndCatchIO . open) item
    (text . pack) ("Opened " ++ item ++ ".")

findWithPreds :: RecursionPredicate
              -> (String -> FilterPredicate)
              -> String
              -> [FilePath]
              -> IO [FilePath]
findWithPreds rPred fPred term rootPaths =
  concat <$> mapM (find rPred (fPred term)) rootPaths

fileNameContains :: String -> FilterPredicate
fileNameContains term = (isInfixOf (toLowerStr term) . toLowerStr) <$> fileName

toLowerStr :: String -> String
toLowerStr = fmap toLower
