module Agrippa.Plugins.AppLauncher (launch, prompt) where

import Prelude (Unit, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Data.String (trim)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config)

prompt :: Config -> String -> String
prompt _ input = "Open application '" <> (trim input) <> "'."

launch :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch _ input displayOutput =
  "Opening '" <> (trim input) <> "'..." <$
  runAff
    (const (pure unit))
    (\{ response: r } -> displayOutput r)
    (get ("/agrippa/app-launcher/" <> (trim input)))

