module Agrippa.Plugins.Base (Plugin(..)) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)

-- A Plugin implements a specific functionality in Agrippa.
-- Multiple tasks may be backed by the same plugin, usually with different configurations.
newtype Plugin =
  Plugin { name          :: String

         , onInputChange :: String  -- task name
                         -> Config  -- task config
                         -> String  -- input
                         -- sometimes it takes a while to compute the real output;
                         -- this callback function provides a mechanism to display the output asynchronously
                         -> (JQuery -> Effect Unit)
                         -- output (might be overwritten by the callback function above)
                         -> Effect (Maybe JQuery)

         , onActivation  :: String  -- task name
                         -> Config  -- task config
                         -> String  -- input
                         -> Effect (Maybe JQuery)
         }

