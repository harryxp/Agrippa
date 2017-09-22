{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.FileSearch (registerHandlers) where

import System.FilePath.Find (always)
import System.Process (callProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Agrippa.Plugins.FileSystem.Commons as C (fileNameContains, registerHandlers)

registerHandlers :: RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers always C.fileNameContains openFile

openFile :: String -> IO ()
openFile file = callProcess "open" [file]
