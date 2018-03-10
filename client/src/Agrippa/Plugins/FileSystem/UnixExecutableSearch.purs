module Agrippa.Plugins.FileSystem.UnixExecutableSearch (unixExecutableSearch) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import DOM (DOM)
import Data.Maybe (Maybe)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Plugins.FileSystem.Commons as C

unixExecutableSearch :: Plugin
unixExecutableSearch = Plugin { name: "UnixExecutableSearch"
                              , onInputChange: suggest
                              , onActivation: open
                              }

suggest :: forall e. String
                  -> Config
                  -> String
                  -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
suggest = C.suggest "/agrippa/unix-executable/suggest" "/agrippa/unix-executable/open"

open :: forall e. String
               -> Config
               -> String
               -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
               -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
open = C.open "/agrippa/unix-executable/open"
