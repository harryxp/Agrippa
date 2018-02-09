{-# LANGUAGE OverloadedStrings #-}
module Agrippa.Plugins.FileSystem.LinuxFileSearch (registerHandlers) where

import Control.Monad (void)
import System.Process (spawnProcess)
import Web.Scotty (RoutePattern, ScottyM)

import qualified Data.Text.Lazy as T (Text)

import Agrippa.Plugins.FileSystem.IndexBuilder (Index)

import qualified Agrippa.Plugins.FileSystem.Commons as C (registerHandlers)

registerHandlers :: Index -> RoutePattern -> RoutePattern -> ScottyM ()
registerHandlers = C.registerHandlers openFile

openFile :: String -> IO ()
openFile file = void $ spawnProcess "xdg-open" [file]
