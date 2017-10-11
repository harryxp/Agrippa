{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.MacFileSearch (registerHandlers) where

import System.Process (callProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers openFile "MacFileSearch"

openFile :: String -> IO ()
openFile file = callProcess "open" [file]
