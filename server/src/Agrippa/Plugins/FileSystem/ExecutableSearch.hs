{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.ExecutableSearch (registerHandlers) where

import System.FilePath.Find (FileType(RegularFile, SymbolicLink), FilterPredicate, always, fileType, (==?), (&&?), (||?))
import System.Process (callCommand)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Agrippa.Plugins.FileSystem.Commons as C (fileNameContains, registerHandlers)

registerHandlers :: RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers always filterPred launchExecutable

filterPred :: String -> FilterPredicate
filterPred term = C.fileNameContains term &&?
                  (fileType ==? RegularFile ||? fileType ==? SymbolicLink)

launchExecutable :: String -> IO ()
launchExecutable = callCommand
