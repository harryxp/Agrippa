module Agrippa.Plugins.FileSystem.MacFileSearch (macFileSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

macFileSearch :: Plugin
macFileSearch = Plugin { name: "MacFileSearch"
                       , onInputChange: C.prompt
                       , onInputChangeAfterTimeout: suggest
                       , onActivation: open
                       }

suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect Unit
suggest = C.suggest "/agrippa/mac-file/suggest" "/agrippa/mac-file/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/mac-file/open"
