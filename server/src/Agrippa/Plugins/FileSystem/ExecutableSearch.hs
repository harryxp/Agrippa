{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.ExecutableSearch (registerHandlers) where

import System.Process (callCommand)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Data.HashMap.Lazy as M (HashMap)
import qualified Data.Text.Lazy    as T (Text)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: M.HashMap String [T.Text] -> RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers openExecutable

openExecutable :: String -> IO ()
openExecutable = callCommand
