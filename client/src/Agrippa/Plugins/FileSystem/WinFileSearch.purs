module Agrippa.Plugins.FileSystem.WinFileSearch (winFileSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

winFileSearch :: Plugin
winFileSearch = Plugin { name: "WinFileSearch"
                       , onInputChange: C.prompt
                       , onInputChangeAfterTimeout: suggest
                       , onActivation: open
                       }
suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect Unit
suggest = C.suggest "/agrippa/win-file/suggest" "/agrippa/win-file/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/win-file/open"

