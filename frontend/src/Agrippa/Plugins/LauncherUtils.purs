module Agrippa.Plugins.LauncherUtils (launch, suggest) where

import Prelude (Unit, const, pure, unit, (<<<), (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Data.Either (Either(..))
import Data.String (joinWith, trim)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.XHR.FormData (FormDataValue(FormDataString), toFormData)
import DOM.XHR.Types (FormData)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config, getStrArrayVal)

suggest :: forall e. String
                  -> Config
                  -> String
                  -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest url config input displayOutput =
  case getStrArrayVal "paths" config of
    Left  err   -> pure err
    Right paths ->
      "Searching..." <$
      runAff
        (const (pure unit))
        (\{ response: r } -> displayOutput r)
        (post url (buildSuggestPayload (trim input) paths))

buildSuggestPayload :: String -> Array String -> FormData
buildSuggestPayload term paths = toFormData [ Tuple "term"  (FormDataString term)
                                            , Tuple "paths" (FormDataString (joinWith " " paths))
                                            ]

launch :: forall e. String
                 -> Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch url config input displayOutput =
  "Launching '" <> (trim input) <> "'..." <$
  runAff
    (const (pure unit))
    (\{ response: r } -> displayOutput r)
    (post url (toFormData [ (Tuple "app" <<< FormDataString <<< trim) input ]))

