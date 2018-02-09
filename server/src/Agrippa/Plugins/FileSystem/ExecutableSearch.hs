{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.ExecutableSearch (registerHandlers) where

import Control.Monad (void)
import System.Process (spawnCommand)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Data.HashMap.Lazy as M (HashMap)
import qualified Data.Text.Lazy    as T (Text)

import Agrippa.Plugins.FileSystem.IndexBuilder (Index)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: Index -> RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers openExecutable

openExecutable :: String -> IO ()
openExecutable = void . spawnCommand
