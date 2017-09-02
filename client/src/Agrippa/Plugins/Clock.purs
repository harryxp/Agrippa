module Agrippa.Plugins.Clock (showTime) where

import Prelude (Unit, bind, pure, (<<<), (<>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Control.Monad.Eff.Now (NOW, nowDateTime)
import Data.DateTime.Locale (LocalValue(..), Locale(..))
import Data.JSDate (fromDateTime, toDateString, toTimeString)

import Agrippa.Config (Config)

showTime :: forall e. Config
                   -> String
                   -> (Array JQuery -> Eff (now :: NOW | e) Unit)
                   -> Eff (now :: NOW | e) String
showTime _ _ _ = do
  LocalValue (Locale maybeLocaleName _) dt <- nowDateTime
  {-
  let localeName = case maybeLocaleName of
                    Just (LocaleName name) -> name
                    Nothing                -> ""
  -}
  (pure <<< (\jsDate -> toTimeString jsDate <> " " <> toDateString jsDate) <<< fromDateTime) dt
