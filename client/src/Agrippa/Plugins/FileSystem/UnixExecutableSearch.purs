module Agrippa.Plugins.FileSystem.UnixExecutableSearch (open, suggest) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import DOM (DOM)
import Data.Maybe (Maybe)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)
import Agrippa.Plugins.FileSystem.Commons as C

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