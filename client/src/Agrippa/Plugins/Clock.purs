module Agrippa.Plugins.Clock (showTime) where

import Prelude (Unit, bind, (<<<), (<>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Control.Monad.Eff.Now (NOW, nowDateTime)
import DOM (DOM)
import Data.DateTime.Locale (LocalValue(..), Locale(..))
import Data.JSDate (fromDateTime, toDateString, toTimeString)

import Agrippa.Config (Config)
import Agrippa.Utils (createSingletonTextNodeArray)

showTime :: forall e. String
                   -> Config
                   -> String
                   -> (Array JQuery -> Eff (dom :: DOM, now :: NOW | e) Unit)
                   -> Eff (dom :: DOM, now :: NOW | e) (Array JQuery)
showTime _ _ _ _ = do
  LocalValue (Locale maybeLocaleName _) dt <- nowDateTime
  {-
  let localeName = case maybeLocaleName of
                    Just (LocaleName name) -> name
                    Nothing                -> ""
  -}
  (createSingletonTextNodeArray <<< (\jsDate -> toTimeString jsDate <> " " <> toDateString jsDate) <<< fromDateTime) dt
