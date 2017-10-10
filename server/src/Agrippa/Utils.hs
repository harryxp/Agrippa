module Agrippa.Utils (getConfigDir, lookupJSON) where

import Data.Aeson (FromJSON, Object, Result(..), fromJSON)
import Data.Text (Text)
import System.Directory (getHomeDirectory)
import System.FilePath.Posix ((</>))

import qualified Data.HashMap.Lazy as M (lookup)

getConfigDir :: IO String
getConfigDir = do
  homeDir <- getHomeDirectory
  return (homeDir </> ".agrippa.d")

lookupJSON :: FromJSON a => Text -> Object -> Maybe a
lookupJSON key m = do
  jValue <- M.lookup key m
  result <- return (fromJSON jValue)
  case result of
    Error   e -> Nothing
    Success v -> Just v

