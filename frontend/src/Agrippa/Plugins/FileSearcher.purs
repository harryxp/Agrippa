module Agrippa.Plugins.FileSearcher (search) where

import Prelude (Unit, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, AffjaxResponse, get)

search :: forall e. String
                 -> (AffjaxResponse String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
search input displayResult =
  "Searching..."
  <$
  runAff (const (pure unit)) displayResult (get ("/agrippa/file-search/" <> input))

-- TODO limit size of output
