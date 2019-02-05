module Agrippa.Plugins.Clock (clock) where

import Prelude (Unit, map, pure, show, (>>>), (>>=))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Now (nowDateTime)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (createTextNode)

clock :: Plugin
clock = Plugin { name: "Clock"
               , onInputChange: showTime
               , onActivation: \_ _ _ _ -> pure Nothing
               }

showTime :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
showTime _ _ _ _ = nowDateTime >>= (show >>> createTextNode >>> map Just)
