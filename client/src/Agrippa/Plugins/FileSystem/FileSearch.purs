module Agrippa.Plugins.FileSystem.FileSearch (open, suggest) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)
import Agrippa.Plugins.FileSystem.Commons as C

suggest :: forall e. Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest = C.suggest "/agrippa/file/suggest" "/agrippa/file/open"

open :: forall e. Config
                 -> String
                 -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
open = C.launch "/agrippa/file/open"

