module Agrippa.Plugins.Launcher (launch, prompt) where

import Prelude (Unit, bind, const, pure, unit, (<$), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Data.Either (Either(..))
import Data.String (joinWith, trim)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.XHR.FormData (FormDataValue(FormDataString), toFormData)
import DOM.XHR.Types (FormData)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config, getStrArrayVal, getStringVal)

prompt :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
prompt config input displayOutput =
  let extAndPaths :: Either String (Tuple String (Array String))
      extAndPaths = do
        ext   <- getStringVal   "ext"   config
        paths <- getStrArrayVal "paths" config
        pure (Tuple ext paths)
  in case extAndPaths of
      Left err  -> pure err
      Right (Tuple ext paths) ->
        "Searching..." <$
        runAff
          (const (pure unit))
          (\{ response: r } -> displayOutput r)
          (post "/agrippa/launch-suggestion" (buildPromptPayload (trim input) ext paths))

buildPromptPayload :: String -> String -> Array String -> FormData
buildPromptPayload app ext paths = toFormData [ Tuple "app"   (FormDataString app)
                                              , Tuple "ext"   (FormDataString ext)
                                              , Tuple "paths" (FormDataString (joinWith " " paths))
                                              ]

launch :: forall e. Config
                 -> String
                 -> (String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch config input displayOutput =
  let cmdAndOpts :: Either String (Tuple String (Array String))
      cmdAndOpts = do
        cmd  <- getStringVal   "cmd"      config
        opts <- getStrArrayVal "cmd-opts" config
        pure (Tuple cmd opts)
  in case cmdAndOpts of
      Left err  -> pure err
      Right (Tuple cmd opts) ->
        "Launching '" <> (trim input) <> "'..." <$
        runAff
          (const (pure unit))
          (\{ response: r } -> displayOutput r)
          (post "/agrippa/launch/" (buildLaunchPayload cmd opts (trim input)))

buildLaunchPayload :: String -> Array String -> String -> FormData
buildLaunchPayload cmd opts app = toFormData [ Tuple "cmd"  (FormDataString cmd)
                                             , Tuple "opts" (FormDataString (joinWith " " opts))
                                             , Tuple "app"  (FormDataString app)
                                             ]
