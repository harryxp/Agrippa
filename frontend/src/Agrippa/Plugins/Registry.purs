module Agrippa.Plugins.Registry (Plugin(..), plugins) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Plugins.Calculator   as C
import Agrippa.Plugins.FileSearch   as F
import Agrippa.Plugins.OnlineSearch as O

newtype Plugin =
  Plugin { name                :: String
         , keyword             :: String
         , onIncrementalChange :: String -> String
         , onActivation        :: forall e. String
                                         -> (String -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit)
                                         -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) String
         }

plugins :: Array Plugin
plugins = [ Plugin { name: "Calculator"
                   , keyword: "="
                   , onIncrementalChange: C.calculate
                   , onActivation: C.calculateOnActivation
                   }
          , Plugin { name: "FileSearch"
                   , keyword: "'"
                   , onIncrementalChange: F.prompt
                   , onActivation: F.search
                   }
          , Plugin { name: "OnlineSearch"
                   , keyword: "o"
                   , onIncrementalChange: O.prompt
                   , onActivation: O.search
                   }
          ]

-- TODO load plugins dynamically
