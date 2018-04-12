module Agrippa.Plugins.Clock (clock) where

import Prelude (Unit, bind, map, pure, (<<<), (<>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Control.Monad.Eff.Now (NOW, nowDateTime)
import DOM (DOM)
import Data.DateTime.Locale (LocalValue(..), Locale(..))
import Data.JSDate (fromDateTime, toDateString, toTimeString)
import Data.Maybe (Maybe(..))

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (createTextNode)

clock :: Plugin
clock = Plugin { name: "Clock"
               , onInputChange: showTime
               , onActivation: \_ _ _ _ -> pure Nothing
               }

showTime :: forall e. String
                   -> Config
                   -> String
                   -> (JQuery -> Eff (dom :: DOM, now :: NOW | e) Unit)
                   -> Eff (dom :: DOM, now :: NOW | e) (Maybe JQuery)
showTime _ _ _ _ = do
  LocalValue (Locale maybeLocaleName _) dt <- nowDateTime
  {-
  let localeName = case maybeLocaleName of
                    Just (LocaleName name) -> name
                    Nothing                -> ""
  -}
  (map Just <<< createTextNode <<< (\jsDate -> toTimeString jsDate <> " " <> toDateString jsDate) <<< fromDateTime) dt
