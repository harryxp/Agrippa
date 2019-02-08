module Agrippa.Plugins.FileSystem.WinFileSearch (winFileSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

winFileSearch :: Plugin
winFileSearch = Plugin { name: "WinFileSearch"
                       , onInputChange: suggest
                       , onActivation: open
                       }
suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
suggest = C.suggest "/agrippa/win-file/suggest" "/agrippa/win-file/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/win-file/open"

