module Agrippa.Plugins.WikiSearcher (prompt, search) where

import Prelude (Unit, bind, pure, (<>))
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

prompt :: String -> String
prompt _ = "Press <Enter> to search on Wikipedia."

search :: forall e. String
                 -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
search input _ = do
  w <- window
  _ <- open ("https://wikipedia.org/wiki/Special:Search/" <> input) "_blank" "" w
  pure "Opening a new window..."

