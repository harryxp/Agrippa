module Agrippa.Plugins.FileSystem.WinExecutableSearch (winExecutableSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

winExecutableSearch :: Plugin
winExecutableSearch = Plugin { name: "WinExecutableSearch"
                             , prompt: C.prompt
                             , promptAfterKeyTimeout: suggest
                             , activate: open
                             }

suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect Unit
suggest = C.suggest "/agrippa/win-executable/suggest" "/agrippa/win-executable/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/win-executable/open"

