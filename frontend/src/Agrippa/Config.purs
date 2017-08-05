module Agrippa.Config (Config, getTaskAttr, getTasksByKeyword, getTaskNamesByKeyword) where

import Prelude (bind, (<>))
import Data.Argonaut.Core (Json, toObject, toString)
import Data.Either (Either)
import Data.StrMap (StrMap, lookup)
import Data.Traversable (traverse)

import Agrippa.Utils (mToE)

type Config = Json

getTasksByKeyword :: Config -> Either String (StrMap Json)
getTasksByKeyword config = do
  configMap          <- mToE "Config Error: must be a JSON object."                            (toObject config)
  tasksByKeywordJson <- mToE "Config Error: must have a 'tasks' attribute."                    (lookup "tasks" configMap)
  mToE                       "Config Error: value of 'tasks' attribute must be a JSON object." (toObject tasksByKeywordJson)

getTaskNamesByKeyword :: Config -> Either String (StrMap String)
getTaskNamesByKeyword config = do
  tasksByKeyword <- getTasksByKeyword config
  traverse (getTaskAttr "task") tasksByKeyword

getTaskAttr :: String -> Json -> Either String String
getTaskAttr attr taskJson = do
  taskConfig      <- mToE "Config Error: each keyword must map to a JSON object."                                        (toObject taskJson)
  taskAttrValJson <- mToE ("Config Error: each keyword must map to a JSON object with a(n) '" <> attr <> "' attribute.") (lookup attr taskConfig)
  mToE                    ("Config Error: value of '" <> attr <> "' attribute must be a string.")                        (toString taskAttrValJson)
