module Agrippa.Plugins.Clock (clock) where

import Prelude (map, pure, unit, (>>>), (>>=))
import Data.Maybe (Maybe(..))
import Data.JSDate (now, toString)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (createTextNode)

clock :: Plugin
clock = Plugin { name: "Clock"
               , prompt: showTime
               , promptAfterKeyTimeout: \_ _ _ _ -> pure unit
               , activate: \_ _ _ -> pure Nothing
               }

showTime :: String -> Config -> String -> Effect (Maybe JQuery)
showTime _ _ _ = now >>= (toString >>> createTextNode >>> map Just)
