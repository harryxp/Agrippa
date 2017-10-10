{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.Index (buildSearchIndices) where

import Data.Aeson (Object, Value(Object))
import Data.HashMap.Lazy (elems, member)
import Data.List (intercalate)
import System.Directory (createDirectoryIfMissing)
import System.FilePath.Find (always, find)
import System.FilePath.Posix ((</>))

import Agrippa.Utils (getConfigDir, lookupJSON)

buildSearchIndices :: Object -> IO ()
buildSearchIndices agrippaConfig =
  case lookupJSON "tasks" agrippaConfig :: Maybe Object of
    Nothing    -> error "Can't find tasks when building indices."
    Just tasks -> (mapM_ buildSearchIndex . filter hasPaths . elems) tasks

hasPaths :: Value -> Bool
hasPaths (Object o) = member "paths" o
hasPaths _          = False

buildSearchIndex :: Value -> IO ()
buildSearchIndex (Object o) =
  let maybeAction :: Maybe (IO ())
      maybeAction = do
        taskName <- lookupJSON "name"   o :: Maybe String
        plugin   <- lookupJSON "plugin" o :: Maybe String
        paths    <- lookupJSON "paths"  o :: Maybe [String]
        Just (buildSearchIndex' taskName plugin paths)
  in case maybeAction of
      Just action -> action
      Nothing     -> error "Can't find 'name', 'plugin', or 'paths' when building indices."
buildSearchIndex _ = error "Task values must be JSON objects."

buildSearchIndex' :: String -> String -> [String] -> IO ()
buildSearchIndex' taskName plugin paths = do
  configDir <- getConfigDir
  let indexDir = configDir </> plugin </> taskName
  createDirectoryIfMissing True indexDir
  files     <- (fmap concat . mapM (find always always)) paths :: IO [String]
  writeFile (indexDir </> "index") (intercalate "\n" files)

