module Agrippa.Plugins.Registry (Plugin(..), namesToPlugins) where

import Prelude (Unit, pure, (<$>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Control.Monad.Eff.Now (NOW)
import Data.Maybe (Maybe(Nothing))
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
import Agrippa.Plugins.KeePass1                    as K
import Agrippa.Plugins.MortgageCalc                as M
import Agrippa.Plugins.OnlineSearch                as O
import Agrippa.Plugins.Snippets                    as S

-- A Plugin implements a specific functionality in Agrippa.
-- Multiple tasks may be backed by the same plugin, usually with different configurations.
newtype Plugin =
  Plugin { name          :: String

         , onInputChange :: forall e. String  -- task name
                                   -> Config  -- task config
                                   -> String  -- input
                                   -- sometimes it takes a while to compute the real output;
                                   -- this callback function provides a mechanism to display the output asynchronously
                                   -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit)
                                   -- output (might be overwritten by the callback function above)
                                   -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) (Maybe JQuery)

                                   -- parameter types are the same as above - for some plugins we can use the same function
         , onActivation  :: forall e. String
                                   -> Config
                                   -> String
                                   -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit)
                                   -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) (Maybe JQuery)
         }

-- All known plugins.  Not necessarily all loaded.
-- Loaded ones are specified in the config file.
plugins :: Array Plugin
plugins = [ Plugin { name: "Calculator"
                   , onInputChange: C.calculate
                   , onActivation: \_ _ _ _ -> pure Nothing
                   }
          , Plugin { name: "Clock"
                   , onInputChange: CLK.showTime
                   , onActivation: \_ _ _ _ -> pure Nothing
                   }
          , Plugin { name: "Mortgage Calculator"
                   , onInputChange: M.showUsage
                   , onActivation: M.calculateMortgage
                   }
          , Plugin { name: "OnlineSearch"
                   , onInputChange: O.prompt
                   , onActivation: O.search
                   }
          , Plugin { name: "Snippets"
                   , onInputChange: S.suggest
                   , onActivation: S.copy
                   }
          -- the following plugins use the backend heavily
          , Plugin { name: "ExecutableSearch"
                   , onInputChange: ES.suggest
                   , onActivation: ES.open
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
                   , onActivation: MAS.open
                   }
          , Plugin { name: "KeePass1"
                   , onInputChange: K.suggest
                   , onActivation: \_ _ _ _ -> pure Nothing
                   }
          ]

namesToPlugins :: StrMap Plugin
namesToPlugins = fromFoldable ((\p@(Plugin { name: n }) -> Tuple n p) <$> plugins)
