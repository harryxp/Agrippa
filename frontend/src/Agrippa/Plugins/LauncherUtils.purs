module Agrippa.Plugins.LauncherUtils (launch, suggest) where

import Prelude (Unit, bind, const, discard, pure, show, unit, (<$), (<$>), (<*>), (<>), (>>=))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, addClass, append, create, setText)
import Data.Array (drop, take, zipWith, (..))
import Data.Either (Either(..))
import Data.String (joinWith, trim)
import Data.String.Utils (lines)
import Data.Traversable (sequence)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.XHR.FormData (FormDataValue(FormDataString), toFormData)
import DOM.XHR.Types (FormData)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config, getStrArrayVal)

suggest :: forall e. String
                  -> String
                  -> Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest suggestUrl launchUrl config input displayOutput =
  case getStrArrayVal "paths" config of
    Left  err   -> pure err
    Right paths ->
      "Searching..." <$
      runAff
        (const (pure unit))
        (\{ response: r } -> buildNodes launchUrl r >>= displayOutput)
        (post suggestUrl (buildSuggestPayload (trim input) paths))

buildSuggestPayload :: String -> Array String -> FormData
buildSuggestPayload term paths = toFormData [ Tuple "term"  (FormDataString term)
                                            , Tuple "paths" (FormDataString (joinWith " " paths))
                                            ]

buildNodes :: forall e. String
                     -> String
                     -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildNodes launchUrl contents = do
  let appNames :: Array String
      appNames = lines contents
      firstNine = buildNodesWithShortcuts launchUrl (take 9 appNames)
      theRest = sequence ((\record -> do
        div <- create "<div>"
        setText record div
        pure div) <$> drop 9 appNames)
  (<>) <$> firstNine <*> theRest

buildNodesWithShortcuts :: forall e. String
                                  -> Array String
                                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildNodesWithShortcuts launchUrl appNames = do
  nodes <- sequence
    (zipWith
      (\index record -> do
        div <- create "<div>"
        setText record div
        span <- create "<span>"
        addClass "shortcut-prompt" span
        setText ("ctrl-" <> show index <> " to open") span
        append span div
        pure div)
     (1..9)
     appNames)
  reinstallShortcuts launchUrl appNames
  pure nodes

foreign import reinstallShortcuts :: forall e. String
                                            -> Array String
                                            -> Eff (ajax :: AJAX, dom :: DOM | e) Unit

launch :: forall e. String
                 -> Config
                 -> String
                 -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch _ _ _ _ = pure "Use shortcuts to launch apps."

