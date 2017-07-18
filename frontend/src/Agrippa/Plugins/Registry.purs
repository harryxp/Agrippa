module Agrippa.Plugins.Registry (Plugin(..), PluginActivationMode(..), plugins) where

import Prelude (class Show, Unit)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, AffjaxResponse)

import Agrippa.Plugins.Calculator as Calc
import Agrippa.Plugins.FileSearcher as F
import Agrippa.Plugins.WikiSearcher as W

data PluginActivationMode = Incremental | Enter

instance showPluginActivationMode :: Show PluginActivationMode where
  show Incremental = "Incremental"
  show Enter = "Enter"

newtype Plugin =
  Plugin { name           :: String
         , keyword        :: String
         , computation    :: forall e. String
                                 -> (AffjaxResponse String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
         , activationMode :: PluginActivationMode
         }

plugins :: Array Plugin
plugins = [ Plugin { name: "Calculator"
                   , keyword: "="
                   , computation: Calc.calculate
                   , activationMode: Incremental
                   }
          , Plugin { name: "FileSearcher"
                   , keyword: "'"
                   , computation: F.search
                   , activationMode: Enter
                   }
          , Plugin { name: "WikiSearcher"
                   , keyword: "w"
                   , computation: W.search
                   , activationMode: Enter
                   }
          ]

-- TODO load plugins dynamically
