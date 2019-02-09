module Agrippa.Plugins.FileSystem.MacAppSearch (macAppSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

macAppSearch :: Plugin
macAppSearch = Plugin { name: "MacAppSearch"
                      , prompt: C.prompt
                      , promptAfterKeyTimeout: suggest
                      , activate: open
                      }

suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect Unit
suggest = C.suggest "/agrippa/mac-app/suggest" "/agrippa/mac-app/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/mac-app/open"

