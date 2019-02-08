module Agrippa.Config (Config, getBooleanVal, getNumberVal, getObjectVal, getStrArrayVal, getStringVal, lookupConfigVal) where

import Prelude (bind, (>=>), (<>))
import Data.Argonaut.Core (Json, toArray, toBoolean, toNumber, toObject, toString)
import Data.Either (Either)
import Data.Maybe (Maybe)
import Data.Traversable (traverse)
import Foreign.Object (Object, lookup)

import Agrippa.Utils (mToE)

type Config = Json

getBooleanVal :: String -> Config -> Either String Boolean
getBooleanVal key config = getConvertedVal key config toBoolean

getNumberVal :: String -> Config -> Either String Number
getNumberVal key config = getConvertedVal key config toNumber

getObjectVal :: String -> Config -> Either String (Object Config)
getObjectVal key config = getConvertedVal key config toObject

getStrArrayVal :: String -> Config -> Either String (Array String)
getStrArrayVal key config = getConvertedVal key config (toArray >=> traverse toString)

getStringVal :: String -> Config -> Either String String
getStringVal key config = getConvertedVal key config toString

getConvertedVal :: forall a. String -> Config -> (Config -> Maybe a) -> Either String a
getConvertedVal key config convert = do
  valJson <- lookupConfigVal key config
  mToE ("Config Error: expect value of '" <> key <> "' to be a different type.") (convert valJson)

lookupConfigVal :: String -> Config -> Either String Config
lookupConfigVal key config = do
  jObject <- mToE  "Config Error: expect JSON object."                                (toObject config)
  mToE            ("Config Error: expect JSON object with a(n) '" <> key <> "' key.") (lookup key jObject)
