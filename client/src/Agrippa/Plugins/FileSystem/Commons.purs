module Agrippa.Plugins.FileSystem.Commons (open, suggest) where

import Prelude (Unit, bind, const, discard, pure, unit, (<$), (<$>), (<>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, addClass, append, create, setAttr, setText)
import Data.Argonaut.Core (Json, fromObject, fromString, toArray, toString)
import Data.Array (drop, length, take, zipWith)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.StrMap (empty, insert)
import Data.Traversable (sequence, traverse)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config)

suggest :: forall e. String
                  -> String
                  -> String
                  -> Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest suggestUrl openUrl taskName config input displayOutput =
  let eitherEff = do
        pure ("Searching..." <$
              runAff
                (const (pure unit))
                (\{ response: r } -> buildOutputNodes openUrl r >>= displayOutput)
                (post suggestUrl (buildSuggestReq taskName (trim input))))
  in case eitherEff of
      Left  err -> pure err
      Right eff -> eff

buildSuggestReq :: String -> String -> Json
buildSuggestReq taskName term = (fromObject <<<
                                 insert "taskName" (fromString taskName) <<<
                                 insert "term"     (fromString term)) empty

shortcuts :: Array String
shortcuts = ["enter", "ctrl-enter", "shift-enter", "alt-enter"]

buildOutputNodes :: forall e. String
                           -> Json
                           -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildOutputNodes openUrl contents =
  case (traverse toString <=< toArray) contents of
    Just items -> do
      nodesWithShortcuts <- buildNodesWithShortcuts openUrl (take (length shortcuts) items)
      otherNodes         <- sequence ((\item -> do
        link <- buildLink item openUrl
        div  <- create "<div>"
        append link div
        pure div) <$> drop (length shortcuts) items)
      pure (nodesWithShortcuts <> otherNodes)
    Nothing       -> do
      div <- create "<div>"
      setText "Error: expect a JSON array of strings from server." div
      pure [div]

buildNodesWithShortcuts :: forall e. String
                                  -> Array String
                                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildNodesWithShortcuts openUrl items = do
  nodes <- sequence
    (zipWith
      (\shortcut item -> do
        link <- buildLink item openUrl
        span <- create "<span>"
        addClass "shortcut-prompt" span
        setText shortcut span
        div  <- create "<div>"
        append link div
        append span div
        pure div)
     shortcuts
     items)
  pure nodes

buildLink :: forall e. String -> String -> Eff (dom :: DOM | e) JQuery
buildLink item openUrl = do
  link <- create "<a>"
  setText item link
  setAttr "href" (openUrl <> "?item=" <> item) link
  pure link

open :: forall e. String
               -> String
               -> Config
               -> String
               -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
               -> Eff (ajax :: AJAX, dom :: DOM | e) String
open _ _ _ _ _ = pure "Please use shortcuts."

