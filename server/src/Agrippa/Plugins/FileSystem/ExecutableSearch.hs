{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.ExecutableSearch (registerHandlers) where

import System.Process (callCommand)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers launchExecutable "ExecutableSearch"

launchExecutable :: String -> IO ()
launchExecutable = callCommand
