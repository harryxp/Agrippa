module Agrippa.Plugins.FileSystem.Commons (registerHandlers) where

import Data.Aeson (Object)
import Data.Char (toLower)
import Data.List (partition)
import System.FilePath (takeBaseName)
import Web.Scotty (ActionM, RoutePattern, ScottyM, get, json, jsonData, liftAndCatchIO, param, post, text)

import qualified Data.HashMap.Lazy as M (HashMap, lookup)
import qualified Data.Text.Lazy    as T (Text, isInfixOf, pack, toLower, unpack)

import Agrippa.Utils (lookupJSON)

registerHandlers :: (String -> IO ())
                 -> M.HashMap String [T.Text]
                 -> RoutePattern
                 -> RoutePattern
                 -> ScottyM ()
registerHandlers open taskNamesToItems suggestUrl openUrl = do
  post suggestUrl $ do
    params <- jsonData :: ActionM Object
    let maybeItems = do
          taskName <- lookupJSON "taskName" params :: Maybe String
          term     <- lookupJSON "term"     params :: Maybe String
          findItems taskNamesToItems taskName term
    case maybeItems of
      Just items -> json items
      Nothing    -> json ([] :: [T.Text])

  get openUrl $ do
    item <- param "item" :: ActionM String
    (liftAndCatchIO . open) item
    (text . T.pack) ("Opened " ++ item ++ ".")

findItems :: M.HashMap String [T.Text] -> String -> String -> Maybe [T.Text]
findItems taskNamesToItems taskName term =
  let lowerTerm     :: String
      lowerTerm     = toLower <$> term
      lowerTermText :: T.Text
      lowerTermText = T.pack lowerTerm
  in do
    items                  <- M.lookup taskName taskNamesToItems :: Maybe [T.Text]
    matches                <- (return . filter (T.isInfixOf lowerTermText . T.toLower)) items :: Maybe [T.Text]
    (exactMatches, others) <- (return . partition ((== lowerTerm) . takeBaseName . T.unpack)) matches :: Maybe ([T.Text], [T.Text])
    -- TODO
    return (take 100 (exactMatches ++ others))

