{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.Commons (registerHandlers) where

import Data.Aeson (Object)
import Data.Char (toLower)
import Data.List (partition)
import System.FilePath (takeBaseName, (</>))
import Web.Scotty (ActionM, RoutePattern, ScottyM, json, jsonData, liftAndCatchIO, param, post, text)

import qualified Data.Text.Lazy    as T   (Text, isInfixOf, lines, pack, toLower, unpack)
import qualified Data.Text.Lazy.IO as TIO (readFile)

import Agrippa.Utils (getConfigDir, lookupJSON)

registerHandlers :: (String -> IO ())
                 -> String
                 -> RoutePattern
                 -> RoutePattern
                 -> ScottyM ()
registerHandlers open plugin suggestUrl openUrl = do
  post suggestUrl $ do
    o <- jsonData :: ActionM Object
    let maybeItems = do
          taskName <- lookupJSON "taskName" o :: Maybe String
          term     <- lookupJSON "term"     o :: Maybe String
          (Just . liftAndCatchIO . findFiles taskName plugin) term
    case maybeItems of
      Just items -> items >>= json
      Nothing    -> json ([] :: [T.Text])

  post openUrl $ do
    item <- param "item" :: ActionM String
    (liftAndCatchIO . open) item
    (text . T.pack) ("Opened " ++ item ++ ".")

findFiles :: String -> String -> String -> IO [T.Text]
findFiles taskName plugin term = do
  configDir <- getConfigDir
  let indexDir = configDir </> plugin </> taskName
  index <- TIO.readFile (indexDir </> "index")
  let items         :: [T.Text]
      items         = T.lines index
      lowerTerm     :: String
      lowerTerm     = toLower <$> term
      lowerTermText :: T.Text
      lowerTermText = T.pack lowerTerm
      matches       :: [T.Text]
      matches       = filter (T.isInfixOf lowerTermText . T.toLower) items
      (exactMatches, others) = partition ((== lowerTerm) . takeBaseName . T.unpack) matches
  return (exactMatches ++ others)

