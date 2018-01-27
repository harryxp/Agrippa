{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.MacAppSearch (registerHandlers) where

import System.Process (callProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Data.HashMap.Lazy as M (HashMap)
import qualified Data.Text.Lazy    as T (Text)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: M.HashMap String [T.Text] -> RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers launchMacApp

launchMacApp :: String -> IO ()
launchMacApp app = callProcess "open" ["-a", app]
