module Agrippa.Plugins.WikiSearcher (search) where

import Prelude (Unit, pure)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import Network.HTTP.Affjax (AffjaxResponse)

search :: forall e. String
                 -> (AffjaxResponse String -> Eff (dom :: DOM | e) Unit)
                 -> Eff (dom :: DOM | e) String
search input displayResult = pure ""
