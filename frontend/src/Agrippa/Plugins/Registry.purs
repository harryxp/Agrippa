module Agrippa.Plugins.Registry (Plugin(..), plugins) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Plugins.Calculator as C
import Agrippa.Plugins.Bookmark as B
import Agrippa.Plugins.FileSearcher as F
import Agrippa.Plugins.WikiSearcher as W

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
          , Plugin { name: "FileSearcher"
                   , keyword: "'"
                   , onIncrementalChange: F.prompt
                   , onActivation: F.search
                   }
          , Plugin { name: "WikiSearcher"
                   , keyword: "w"
                   , onIncrementalChange: W.prompt
                   , onActivation: W.search
                   }
          , Plugin { name: "Bookmark"
                   , keyword: "b"
                   , onIncrementalChange: B.prompt
                   , onActivation: B.goto
                   }
          ]

-- TODO load plugins dynamically
