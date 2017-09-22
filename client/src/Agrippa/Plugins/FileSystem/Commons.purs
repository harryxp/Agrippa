module Agrippa.Plugins.FileSystem.Commons (launch, suggest) where

import Prelude (Unit, bind, const, discard, pure, show, unit, (<$), (<$>), (<>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, addClass, append, create, setText)
import Data.Argonaut.Core (JArray, JObject, Json, fromArray, fromObject, fromString, toArray, toString)
import Data.Array (drop, take, zipWith, (..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.StrMap (empty, insert)
import Data.Traversable (sequence, traverse)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config, getBooleanVal, getStrArrayVal)

suggest :: forall e. String
                  -> String
                  -> Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest suggestUrl launchUrl config input displayOutput =
  let eitherEff = do
        paths           <- getStrArrayVal "paths"           config
        useFunctionKeys <- getBooleanVal  "useFunctionKeys" config
        pure ("Searching..." <$
              runAff
                (const (pure unit))
                (\{ response: r } -> buildOutputNodes useFunctionKeys launchUrl r >>= displayOutput)
                (post suggestUrl (buildSuggestReq (trim input) paths)))
  in case eitherEff of
      Left  err -> pure err
      Right eff -> eff

buildSuggestReq :: String -> Array String -> Json
buildSuggestReq term paths =
  let jsonPaths :: JArray
      jsonPaths = fromString <$> paths
      m :: JObject
      m = (insert "paths" (fromArray jsonPaths) <<<
           insert "term"  (fromString term)) empty
  in fromObject m

buildOutputNodes :: forall e. Boolean
                           -> String
                           -> Json
                           -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildOutputNodes useFunctionKeys launchUrl contents =
  case (traverse toString <=< toArray) contents of
    Just items -> do
      nodesWithShortcuts <- buildNodesWithShortcuts useFunctionKeys launchUrl (take 9 items)
      otherNodes         <- sequence ((\record -> do
        div <- create "<div>"
        setText record div
        pure div) <$> drop 9 items)
      pure (nodesWithShortcuts <> otherNodes)
    Nothing       -> do
      div <- create "<div>"
      setText "Error: expect a JSON array of strings from server." div
      pure [div]

buildNodesWithShortcuts :: forall e. Boolean
                                  -> String
                                  -> Array String
                                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildNodesWithShortcuts useFunctionKeys launchUrl items = do
  nodes <- sequence
    (zipWith
      (\index record -> do
        div  <- create "<div>"
        setText record div
        span <- create "<span>"
        addClass "shortcut-prompt" span
        setText ("ctrl-" <> (if useFunctionKeys then "f" else "") <> show index) span
        append span div
        pure div)
     (1..9)
     items)
  reinstallShortcuts useFunctionKeys launchUrl items
  pure nodes

foreign import reinstallShortcuts :: forall e. Boolean
                                            -> String
                                            -> Array String
                                            -> Eff (ajax :: AJAX, dom :: DOM | e) Unit

launch :: forall e. String
                 -> Config
                 -> String
                 -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch _ _ _ _ = pure "Use shortcuts to launch apps."

