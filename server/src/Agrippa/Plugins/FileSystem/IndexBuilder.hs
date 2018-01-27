{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.IndexBuilder (buildSearchIndices) where

import Data.Aeson (Object, Value(Object))
import Data.List (elem)
import System.Directory (createDirectoryIfMissing)
import System.FilePath.Find (FileType(Directory, RegularFile, SymbolicLink), FilterPredicate, RecursionPredicate, always, extension, find, fileType, (==?), (/=?), (&&?), (||?))
import System.FilePath ((</>))

import qualified Data.HashMap.Lazy as M (HashMap, elems, fromList, lookup)
import qualified Data.Text.Lazy    as T (Text, pack)

import Agrippa.Utils (getConfigDir, lookupJSON)

type TaskName = String

buildSearchIndices :: Object -> IO (M.HashMap TaskName [T.Text])
buildSearchIndices agrippaConfig =
  case lookupJSON "tasks" agrippaConfig :: Maybe Object of
    Nothing    -> error "Can't find tasks when building indices."
    Just tasks -> (fmap M.fromList . mapM buildSearchIndex . filter usesFileSearchPlugin . M.elems) tasks

usesFileSearchPlugin :: Value -> Bool
usesFileSearchPlugin (Object o) = case lookupJSON "plugin" o of
  Just plugin -> elem plugin allFileSearchPlugins
  Nothing     -> False
usesFileSearchPlugin _ = False

allFileSearchPlugins :: [String]
allFileSearchPlugins = [ "ExecutableSearch"
                       , "LinuxFileSearch"
                       , "MacAppSearch"
                       , "MacFileSearch"
                       ]

buildSearchIndex :: Value -> IO (TaskName, [T.Text])
buildSearchIndex (Object o) =
  let maybeAction :: Maybe (IO (TaskName, [T.Text]))
      maybeAction = do
        taskName <- lookupJSON "name"   o :: Maybe String
        plugin   <- lookupJSON "plugin" o :: Maybe String
        paths    <- lookupJSON "paths"  o :: Maybe [String]
        Just (buildSearchIndex' taskName plugin paths)
  in case maybeAction of
      Just action -> action
      Nothing     -> error "Can't find 'name', 'plugin', or 'paths' when building indices."
buildSearchIndex _ = error "Task values must be JSON objects."

buildSearchIndex' :: TaskName -> String -> [String] -> IO (TaskName, [T.Text])
buildSearchIndex' taskName plugin paths = do
  configDir <- getConfigDir
  let indexDir = configDir </> plugin </> taskName
  createDirectoryIfMissing True indexDir
  let predicates = do
       recursionPred <- M.lookup plugin pluginToRecursionPredicate
       filterPred    <- M.lookup plugin pluginToFilterPredicate
       return (recursionPred, filterPred)
  files <- case predicates of
    Just (rPred, fPred) -> (fmap concat . mapM (find rPred fPred)) paths :: IO [String]
    Nothing -> error ("Failed to lookup predicates for plugin" ++ plugin)
  return (taskName, T.pack <$> files)

pluginToRecursionPredicate :: M.HashMap String RecursionPredicate
pluginToRecursionPredicate = M.fromList [ ("ExecutableSearch", always)
                                        , ("LinuxFileSearch",  always)
                                        , ("MacAppSearch",     (extension /=? ".app"))
                                        , ("MacFileSearch",    always)
                                        ]

pluginToFilterPredicate :: M.HashMap String FilterPredicate
pluginToFilterPredicate = M.fromList [ ("ExecutableSearch", isFile)
                                     , ("LinuxFileSearch",  always)
                                     , ("MacAppSearch",     isMacApp)
                                     , ("MacFileSearch",    always)
                                     ]

isFile :: FilterPredicate
isFile = fileType ==? RegularFile ||? fileType ==? SymbolicLink

isMacApp :: FilterPredicate
isMacApp = fileType ==? Directory &&? extension ==? ".app"

