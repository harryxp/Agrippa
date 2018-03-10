module Agrippa.Plugins.Base (Plugin(..)) where

import Prelude (Unit)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Control.Monad.Eff.Now (NOW)
import Data.Maybe (Maybe)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Network.HTTP.Affjax (AJAX)

import Agrippa.Config (Config)

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

