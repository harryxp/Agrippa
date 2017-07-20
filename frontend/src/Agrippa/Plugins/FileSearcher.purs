module Agrippa.Plugins.FileSearcher (prompt, search) where

import Prelude (Unit, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Data.String (trim)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, get)

prompt :: String -> String
prompt _ = "Press <Enter> to search files."

search :: forall e. String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
search input displayResult =
  "Searching..."
  <$
  runAff (const (pure unit)) (\{ response: r } -> displayResult r) (get ("/agrippa/file-search/" <> (trim input)))

-- TODO limit size of output
-- TODO highlight keyword
-- TODO error handler
-- TODO check status code?
