module Agrippa.Plugins.FileSearcher (search) where

import Prelude (Unit, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, get)

search :: forall e. String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
search input displayResult =
  "Searching..."
  <$
  runAff (const (pure unit)) (\{ response: r } -> displayResult r) (get ("/agrippa/file-search/" <> input))

-- TODO limit size of output
-- TODO highlight keyword
-- TODO error handler
-- TODO check status code?
