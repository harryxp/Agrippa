{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.Commons (registerHandlers) where

import Data.Aeson (Object)
import Data.List (isInfixOf)
import Data.Text.Lazy (pack)
import System.FilePath.Posix ((</>))
import Web.Scotty (ActionM, RoutePattern, ScottyM, json, jsonData, liftAndCatchIO, param, post, text)

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
      Just items -> items >>= json . take 40
      Nothing    -> json ([] :: [String])

  post openUrl $ do
    item <- param "item" :: ActionM String
    (liftAndCatchIO . open) item
    (text . pack) ("Opened " ++ item ++ ".")

findFiles :: String -> String -> String -> IO [FilePath]
findFiles taskName plugin term = do
  configDir <- getConfigDir
  let indexDir = configDir </> plugin </> taskName
  index <- readFile (indexDir </> "index")
  (return . filter (isInfixOf term) . lines) index

