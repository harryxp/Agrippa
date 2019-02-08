module Agrippa.Plugins.PluginType (Plugin(..)) where

import Prelude (Unit)
import Data.Maybe (Maybe)
import Effect (Effect)
import JQuery (JQuery)

import Agrippa.Config (Config)

-- A Plugin implements a specific functionality in Agrippa.
-- Multiple tasks may be backed by the same plugin, usually with different configurations.
newtype Plugin =
  Plugin { name          :: String

         -- called each time there's new input
         -- this function is expected to be fast enough to provide quick feedback to the user
         , onInputChange             :: String  -- task name
                                     -> Config  -- task config
                                     -> String  -- input
                                     -> Effect (Maybe JQuery)

         -- called if keyTimeoutInMs (configurable per task) has passed since the last new input
         -- this function provides a mechanism for the plugin to NOT react every single time the user types something
         -- typically this function runs an Aff therefore it needs the callback parameter
         , onInputChangeAfterTimeout :: String  -- task name
                                     -> Config  -- task config
                                     -> String  -- input
                                     -> (JQuery -> Effect Unit)
                                     -> Effect Unit

         -- called when <enter> is pressed
         , onActivation              :: String  -- task name
                                     -> Config  -- task config
                                     -> String  -- input
                                     -> Effect (Maybe JQuery)
         }

