module Agrippa.Plugins.Clock (clock) where

import Prelude (Unit, map, pure, show, unit, (>>>), (>>=))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Now (nowDateTime)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (createTextNode)

clock :: Plugin
clock = Plugin { name: "Clock"
               , onInputChange: showTime
               , onInputChangeAfterTimeout: \_ _ _ _ -> pure unit
               , onActivation: \_ _ _ -> pure Nothing
               }

showTime :: String -> Config -> String -> Effect (Maybe JQuery)
showTime _ _ _ = nowDateTime >>= (show >>> createTextNode >>> map Just)
