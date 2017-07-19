module Agrippa.Plugins.WikiSearcher (search) where

import Prelude (Unit, pure)
import Control.Monad.Eff (Eff)
import DOM (DOM)

search :: forall e. String
                 -> (String -> Eff (dom :: DOM | e) Unit)
                 -> Eff (dom :: DOM | e) String
search input displayResult = pure ""
