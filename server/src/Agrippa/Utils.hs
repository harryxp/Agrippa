module Agrippa.Utils (getConfigDir, lookupJSON) where

import Data.Aeson (FromJSON, Object, Result(Error, Success), fromJSON)
import Data.Text (Text)
import System.Directory (getAppUserDataDirectory)

import qualified Data.HashMap.Lazy as M (lookup)

getConfigDir :: IO String
getConfigDir = getAppUserDataDirectory "agrippa.d"

lookupJSON :: FromJSON a => Text -> Object -> Maybe a
lookupJSON key m = do
  jValue <- M.lookup key m
  case fromJSON jValue of
    Error   _ -> Nothing
    Success v -> Just v

