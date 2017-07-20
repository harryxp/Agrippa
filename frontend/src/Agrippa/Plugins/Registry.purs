module Agrippa.Plugins.Registry (Plugin(..), PluginActivationMode(..), plugins) where

import Prelude (class Show, Unit)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Plugins.Calculator as Calc
import Agrippa.Plugins.Bookmark as B
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
                                    -> (String -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit)
                                    -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) String
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
          , Plugin { name: "Bookmark"
                   , keyword: "b"
                   , computation: B.goto
                   , activationMode: Enter
                   }
          ]

-- TODO load plugins dynamically
