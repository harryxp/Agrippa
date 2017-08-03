module Agrippa.Plugins.FileSearch (prompt, search) where

import Prelude (Unit, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Data.String (trim)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config)

prompt :: Config -> String -> String
prompt _ _ = "Press <Enter> to search files."

search :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
search _ input displayOutput =
  "Searching..." <$
  runAff
    (const (pure unit))
    (\{ response: r } -> displayOutput r)
    (get ("/agrippa/file-search/" <> (trim input)))

-- TODO limit size of output
-- TODO highlight keyword
-- TODO error handler for runAff
-- TODO check status code?
-- TODO 500 internal error when locate fails
