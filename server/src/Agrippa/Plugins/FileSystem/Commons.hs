{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.Commons (registerHandlers) where

import Data.Aeson (Object)
import Data.Char (toLower)
import Data.List (partition)
import System.FilePath (takeBaseName)
import Web.Scotty (ActionM, RoutePattern, ScottyM, get, json, jsonData, liftAndCatchIO, param, post, text)

import qualified Data.HashMap.Lazy as M (lookup)
import qualified Data.Text.Lazy    as T (Text, isPrefixOf, pack, toLower, unpack)

import Agrippa.Plugins.FileSystem.IndexBuilder (Index)
import Agrippa.Utils (lookupJSON)

registerHandlers :: (String -> IO ())
                 -> Index
                 -> RoutePattern
                 -> RoutePattern
                 -> ScottyM ()
registerHandlers open taskNamesToItems suggestUrl openUrl = do
  post suggestUrl $ do
    o <- jsonData :: ActionM Object
    let maybeItems = do
          taskName <- lookupJSON "taskName" o :: Maybe String
          term     <- lookupJSON "term"     o :: Maybe String
          findItems taskNamesToItems taskName term
    case maybeItems of
      Just items -> json items
      Nothing    -> json ([] :: [T.Text])

  get openUrl $ do
    item <- param "item" :: ActionM String
    (liftAndCatchIO . open) item
    (text . T.pack) ("Opened " ++ item ++ ".")

findItems :: Index -> String -> String -> Maybe [T.Text]
findItems taskNamesToItems taskName term =
  let lowerTerm :: T.Text
      lowerTerm = (T.toLower . T.pack) term
  in do
    baseNamesAnditems <- M.lookup taskName taskNamesToItems :: Maybe [(T.Text, T.Text)]
    let matches                = filter (T.isPrefixOf lowerTerm . fst) baseNamesAnditems
        (exactMatches, others) = partition ((== lowerTerm) . fst) matches
    (return . take 100 . fmap snd) (exactMatches ++ others)
