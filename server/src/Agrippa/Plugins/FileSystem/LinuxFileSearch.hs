{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.LinuxFileSearch (registerHandlers) where

import System.Process (callProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers openFile "LinuxFileSearch"

openFile :: String -> IO ()
openFile file = callProcess "xdg-open" [file]
