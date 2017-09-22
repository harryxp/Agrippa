{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.MacAppSearch (registerHandlers) where

import System.FilePath.Find (FileType(Directory), FilterPredicate, RecursionPredicate, extension, fileType, (==?), (/=?), (&&?))
import System.Process (callProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Agrippa.Plugins.FileSystem.Commons as C (fileNameContains, registerHandlers)

registerHandlers :: RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers recursionPred filterPred launchMacApp

recursionPred :: RecursionPredicate
recursionPred = extension /=? ".app"

filterPred :: String -> FilterPredicate
filterPred term = C.fileNameContains term &&?
                  fileType ==? Directory &&?
                  extension ==? ".app"

launchMacApp :: String -> IO ()
launchMacApp app = callProcess "open" ["-a", app]
