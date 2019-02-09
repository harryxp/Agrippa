module Agrippa.Plugins.Clock (clock) where

import Prelude (map, pure, show, unit, (>>>), (>>=))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Now (nowDateTime)
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
showTime _ _ _ = nowDateTime >>= (show >>> createTextNode >>> map Just)
