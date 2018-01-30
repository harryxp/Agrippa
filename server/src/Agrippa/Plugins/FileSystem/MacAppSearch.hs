{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.MacAppSearch (registerHandlers) where

import Control.Monad (void)
import System.Process (spawnProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Data.HashMap.Lazy as M (HashMap)
import qualified Data.Text.Lazy    as T (Text)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: M.HashMap String [T.Text] -> RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers openMacApp

openMacApp :: String -> IO ()
openMacApp app = void $ spawnProcess "open" [app]
