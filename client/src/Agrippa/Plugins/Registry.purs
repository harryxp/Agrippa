module Agrippa.Plugins.Registry (Plugin(..), pluginsByName) where

import Prelude (Unit, (<$>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Control.Monad.Eff.Now (NOW)
import Data.StrMap (StrMap, fromFoldable)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)
import Agrippa.Plugins.Calculator                  as C
import Agrippa.Plugins.Clock                       as CLK
import Agrippa.Plugins.FileSystem.ExecutableSearch as E
import Agrippa.Plugins.FileSystem.FileSearch       as F
import Agrippa.Plugins.FileSystem.MacAppSearch     as M
import Agrippa.Plugins.OnlineSearch                as O

newtype Plugin =
  Plugin { name          :: String
         , onInputChange :: forall e. Config
                                   -> String
                                   -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit)
                                   -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) String
         , onActivation  :: forall e. Config
                                   -> String
                                   -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit)
                                   -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) String
         }

plugins :: Array Plugin
plugins = [ Plugin { name: "Calculator"
                   , onInputChange: C.calculate
                   , onActivation: C.calculate
                   }
          , Plugin { name: "Clock"
                   , onInputChange: CLK.showTime
                   , onActivation: CLK.showTime
                   }
          , Plugin { name: "ExecutableSearch"
                   , onInputChange: E.suggest
                   , onActivation: E.launch
                   }
          , Plugin { name: "FileSearch"
                   , onInputChange: F.suggest
                   , onActivation: F.open
                   }
          , Plugin { name: "MacAppSearch"
                   , onInputChange: M.suggest
                   , onActivation: M.launch
                   }
          , Plugin { name: "OnlineSearch"
                   , onInputChange: O.prompt
                   , onActivation: O.search
                   }
          ]

pluginsByName :: StrMap Plugin
pluginsByName = fromFoldable ((\p@(Plugin { name: n }) -> Tuple n p) <$> plugins)
