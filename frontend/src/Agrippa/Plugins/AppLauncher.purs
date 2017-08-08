module Agrippa.Plugins.AppLauncher (launch, prompt) where

import Prelude (Unit, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Data.Either (Either(..))
import Data.String (trim)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.XHR.FormData (FormDataValue(FormDataString), toFormData)
import DOM.XHR.Types (FormData)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config, getStringVal)

prompt :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
prompt _ input _ = pure ("Open application '" <> (trim input) <> "'.")

launch :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch config input displayOutput =
  case getStringVal "cmd" config of
    Left err  -> pure err
    Right cmd ->
      "Opening '" <> (trim input) <> "'..." <$
      runAff
        (const (pure unit))
        (\{ response: r } -> displayOutput r)
        (post "/agrippa/app-launcher/" (buildPayload cmd (trim input)))

buildPayload :: String -> String -> FormData
buildPayload cmd app = toFormData [ Tuple "cmd" (FormDataString cmd)
                                  , Tuple "app" (FormDataString app)
                                  ]
