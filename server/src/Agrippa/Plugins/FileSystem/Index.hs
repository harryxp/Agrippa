{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.Index (buildSearchIndices) where

import Data.Aeson (Object, Value(Object))
import Data.List (intercalate)
import System.Directory (createDirectoryIfMissing, renameFile)
import System.FilePath.Find (FileType(Directory, RegularFile, SymbolicLink), FilterPredicate, RecursionPredicate, always, extension, find, fileType, (==?), (/=?), (&&?), (||?))
import System.FilePath ((</>))

import qualified Data.HashMap.Lazy as M (HashMap, elems, fromList, lookup, member)

import Agrippa.Utils (getConfigDir, lookupJSON)

buildSearchIndices :: Object -> IO ()
buildSearchIndices agrippaConfig =
  case lookupJSON "tasks" agrippaConfig :: Maybe Object of
    Nothing    -> error "Can't find tasks when building indices."
    Just tasks -> (mapM_ buildSearchIndex . filter hasPaths . M.elems) tasks

hasPaths :: Value -> Bool
hasPaths (Object o) = M.member "paths" o
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
  let predicates = do
       recursionPred <- M.lookup plugin recursionPredicatesByPlugin
       filterPred    <- M.lookup plugin filterPredicatesByPlugin
       return (recursionPred, filterPred)
  files <- case predicates of
    Just (rPred, fPred) -> (fmap concat . mapM (find rPred fPred)) paths :: IO [String]
    Nothing -> error ("Failed to lookup predicates for plugin" ++ plugin)
  writeFile  (indexDir </> "index.tmp") (intercalate "\n" files)
  renameFile (indexDir </> "index.tmp") (indexDir </> "index")

recursionPredicatesByPlugin :: M.HashMap String RecursionPredicate
recursionPredicatesByPlugin = M.fromList [ ("ExecutableSearch", always)
                                         , ("LinuxFileSearch",  always)
                                         , ("MacAppSearch",     (extension /=? ".app"))
                                         , ("MacFileSearch",    always)
                                         ]

filterPredicatesByPlugin :: M.HashMap String FilterPredicate
filterPredicatesByPlugin = M.fromList [ ("ExecutableSearch", isFile)
                                      , ("LinuxFileSearch",  always)
                                      , ("MacAppSearch",     isMacApp)
                                      , ("MacFileSearch",    always)
                                      ]

isFile :: FilterPredicate
isFile = fileType ==? RegularFile ||? fileType ==? SymbolicLink

isMacApp :: FilterPredicate
isMacApp = fileType ==? Directory &&? extension ==? ".app"

