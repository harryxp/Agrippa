module Agrippa.Utils (lookupJSON) where

import Data.Aeson (FromJSON, Object, Result(..), fromJSON)
import Data.Text (Text)

import qualified Data.HashMap.Lazy as M (lookup)

lookupJSON :: FromJSON a => Text -> Object -> Maybe a
lookupJSON key m = do
  jValue <- M.lookup key m
  result <- return (fromJSON jValue)
  case result of
    Error e   -> Nothing
    Success v -> Just v

