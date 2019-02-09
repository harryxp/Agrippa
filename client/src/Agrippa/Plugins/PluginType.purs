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

         {- Called each time there's new input.

            This function is expected to be fast enough to provide continuous feedback to the user.
          -}
         , prompt                :: String  -- task name
                                 -> Config  -- task config
                                 -> String  -- input
                                 -> Effect (Maybe JQuery)

         {- Called if keyTimeoutInMs has passed since the last new input.

            This function provides a mechanism for the plugin to NOT react every single time the user types something.
            Typically this function runs an Aff that involves some slow IO, therefore it needs the callback parameter
            keyTimeoutInMs is configurable per task.  The default is 0.
         -}
         , promptAfterKeyTimeout :: String  -- task name
                                 -> Config  -- task config
                                 -> String  -- input
                                 -> (JQuery -> Effect Unit) -- callback function
                                 -> Effect Unit

         -- called when <enter> is pressed
         , activate              :: String  -- task name
                                 -> Config  -- task config
                                 -> String  -- input
                                 -> Effect (Maybe JQuery)
         }

