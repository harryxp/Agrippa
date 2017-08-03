module Agrippa.Plugins.Utils (openWebsite) where

import Prelude (bind, pure)
import Control.Monad.Eff (Eff)
import Data.Maybe (Maybe(..))
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

openWebsite :: forall e. String -> Eff (dom :: DOM, window :: WINDOW | e) String
openWebsite url = do
  w <- window
  maybeNewWindow <- open url "_self" "" w
  pure case maybeNewWindow of
        Nothing -> "Something went really wrong..."
        Just _  -> "Opening..."
