module Agrippa.Plugins.FileSystem.UnixExecutableSearch (unixExecutableSearch) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

unixExecutableSearch :: Plugin
unixExecutableSearch = Plugin { name: "UnixExecutableSearch"
                              , onInputChange: suggest
                              , onActivation: open
                              }

suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
suggest = C.suggest "/agrippa/unix-executable/suggest" "/agrippa/unix-executable/open"

open :: String -> Config -> String -> Effect (Maybe JQuery)
open = C.open "/agrippa/unix-executable/open"
