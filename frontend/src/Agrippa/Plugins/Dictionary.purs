module Agrippa.Plugins.Dictionary (prompt, lookup) where

import Prelude (Unit, (<>))
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)

import Agrippa.Plugins.Utils (openWebsite)

prompt :: String -> String
prompt _ = "Keep typing.  Press <Enter> to lookup."

lookup :: forall e. String
                 -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
lookup input _ = openWebsite ("https://www.merriam-webster.com/dictionary/" <> input)
