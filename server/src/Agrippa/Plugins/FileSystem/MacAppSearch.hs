{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.MacAppSearch (registerHandlers) where

import System.Process (callProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers launchMacApp "MacAppSearch"

launchMacApp :: String -> IO ()
launchMacApp app = callProcess "open" ["-a", app]
