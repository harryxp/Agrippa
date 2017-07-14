module Agrippa.Plugins.Registry (Plugin(..), plugins) where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (EXCEPTION)
import DOM (DOM)
import Network.HTTP.Affjax

import Agrippa.Plugins.Calculator as Calc
import Agrippa.Plugins.FileSearcher as F

newtype Plugin = Plugin { name        :: String
                        , keyword     :: String
                        , computation :: forall e. String
                                                -> (AffjaxResponse String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                                                -> Eff (ajax :: AJAX, dom :: DOM | e) String
                        }

plugins :: Array Plugin
plugins = [ Plugin { name: "Calculator", keyword: "=", computation: Calc.calculate }
          , Plugin { name: "FileSearcher", keyword: "'", computation: F.search }
          ]

-- TODO load plugins dynamically
