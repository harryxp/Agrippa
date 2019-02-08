module Agrippa.Plugins.FileSystem.WinExecutableSearch (winExecutableSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

winExecutableSearch :: Plugin
winExecutableSearch = Plugin { name: "WinExecutableSearch"
                             , onInputChange: suggest
                             , onActivation: open
                             }

suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
suggest = C.suggest "/agrippa/win-executable/suggest" "/agrippa/win-executable/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/win-executable/open"

