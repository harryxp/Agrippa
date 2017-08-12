module Agrippa.Plugins.ExecutableLauncher (launch, suggest) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)
import Agrippa.Plugins.LauncherUtils as U

suggest :: forall e. Config
                  -> String
                  -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest = U.suggest "/agrippa/launch-exec-suggestion"

launch :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch = U.launch "/agrippa/launch-exec"
