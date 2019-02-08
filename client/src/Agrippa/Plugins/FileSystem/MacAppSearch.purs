module Agrippa.Plugins.FileSystem.MacAppSearch (macAppSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

macAppSearch :: Plugin
macAppSearch = Plugin { name: "MacAppSearch"
                      , onInputChange: suggest
                      , onActivation: open
                      }

suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
suggest = C.suggest "/agrippa/mac-app/suggest" "/agrippa/mac-app/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/mac-app/open"

