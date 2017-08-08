module Agrippa.Plugins.FileSearch (prompt, search) where

import Prelude (Unit, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Data.String (trim)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config)

prompt :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
prompt _ _ _ = pure "Press <Enter> to search files."

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

