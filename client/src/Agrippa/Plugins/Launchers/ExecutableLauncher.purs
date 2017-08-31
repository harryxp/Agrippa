module Agrippa.Plugins.Launcher.ExecutableLauncher (launch, suggest) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)
import Agrippa.Plugins.Launcher.LauncherUtils as U

suggest :: forall e. Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest = U.suggest "/agrippa/launch-exec-suggestion" "/agrippa/launch-exec"

launch :: forall e. Config
                 -> String
                 -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch = U.launch "/agrippa/launch-exec"
