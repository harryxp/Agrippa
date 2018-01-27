module Agrippa.Plugins.Registry (Plugin(..), nameToPlugin) where

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
import Agrippa.Plugins.FileSystem.ExecutableSearch as ES
import Agrippa.Plugins.FileSystem.LinuxFileSearch  as LFS
import Agrippa.Plugins.FileSystem.MacFileSearch    as MFS
import Agrippa.Plugins.FileSystem.MacAppSearch     as MAS
import Agrippa.Plugins.OnlineSearch                as O

newtype Plugin =
  Plugin { name          :: String
         , onInputChange :: forall e. String
                                   -> Config
                                   -> String
                                   -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit)
                                   -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) String
         , onActivation  :: forall e. String
                                   -> Config
                                   -> String
                                   -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit)
                                   -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) String
         }

-- All known plugins.  Not necessarily all loaded.
-- Loaded ones are specified in the config file.
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
                   , onInputChange: ES.suggest
                   , onActivation: ES.launch
                   }
          , Plugin { name: "LinuxFileSearch"
                   , onInputChange: LFS.suggest
                   , onActivation: LFS.open
                   }
          , Plugin { name: "MacFileSearch"
                   , onInputChange: MFS.suggest
                   , onActivation: MFS.open
                   }
          , Plugin { name: "MacAppSearch"
                   , onInputChange: MAS.suggest
                   , onActivation: MAS.launch
                   }
          , Plugin { name: "OnlineSearch"
                   , onInputChange: O.prompt
                   , onActivation: O.search
                   }
          ]

nameToPlugin :: StrMap Plugin
nameToPlugin = fromFoldable ((\p@(Plugin { name: n }) -> Tuple n p) <$> plugins)
