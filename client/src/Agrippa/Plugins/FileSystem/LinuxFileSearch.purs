module Agrippa.Plugins.FileSystem.LinuxFileSearch (open, suggest) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)
import Agrippa.Plugins.FileSystem.Commons as C

suggest :: forall e. String
                  -> Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
suggest = C.suggest "/agrippa/linux-file/suggest" "/agrippa/linux-file/open"

open :: forall e. String
               -> Config
               -> String
               -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
               -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
open = C.open "/agrippa/linux-file/open"
