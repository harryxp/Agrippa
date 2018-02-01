module Agrippa.Plugins.FileSystem.Commons (open, suggest) where

import Prelude (Unit, bind, const, discard, pure, show, unit, (<*), (<$>), (<>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, addClass, append, create, setProp, setText)
import Data.Argonaut.Core (Json, fromObject, fromString, toArray, toString)
import Data.Array (drop, take, zipWith, (..))
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.StrMap (empty, insert)
import Data.Traversable (sequence, traverse)
import DOM (DOM)
import Global (encodeURIComponent)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config)
import Agrippa.Utils (createSingletonTextNodeArray)

suggest :: forall e. String
                  -> String
                  -> String
                  -> Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
suggest suggestUrl openUrl taskName config input displayOutput =
  createSingletonTextNodeArray "Searching..." <*
  runAff
    (const (pure unit))
    (\{ response: r } -> buildOutputNodes openUrl r >>= displayOutput)
    (post suggestUrl (buildSuggestReq taskName (trim input)))

buildSuggestReq :: String -> String -> Json
buildSuggestReq taskName term = (fromObject <<<
                                 insert "taskName" (fromString taskName) <<<
                                 insert "term"     (fromString term)) empty

numOfShortcuts :: Int
numOfShortcuts = 9

buildOutputNodes :: forall e. String
                           -> Json
                           -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildOutputNodes openUrl contents =
  case (traverse toString <=< toArray) contents of
    Just items -> do
      nodesWithShortcuts <- buildNodesWithShortcuts openUrl (take numOfShortcuts items)
      otherNodes         <- sequence ((\item -> do
        link <- buildLink item openUrl
        div  <- create "<div>"
        append link div
        pure div) <$> drop numOfShortcuts items)
      pure (nodesWithShortcuts <> otherNodes)
    Nothing       -> do
      div <- create "<div>"
      setText "Error: expect a JSON array of strings from server." div
      pure [div]

buildNodesWithShortcuts :: forall e. String
                                  -> Array String
                                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildNodesWithShortcuts openUrl items = do
  sequence
    (zipWith
      (\index item -> do
        div  <- create "<div>"

        link <- buildLink item openUrl
        append link div

        span <- create "<span>"
        addClass "shortcut-prompt" span
        setText ("ctrl+shift+" <> show index) span
        append span div

        installShortcutHandler openUrl index item

        pure div)
     (1 .. numOfShortcuts)
     items)

buildLink :: forall e. String -> String -> Eff (dom :: DOM | e) JQuery
buildLink item openUrl = do
  link <- create "<a>"
  setText item link
  setProp "href" (openUrl <> "?item=" <> encodeURIComponent item) link
  pure link

foreign import installShortcutHandler :: forall e. String
                                                -> Int
                                                -> String
                                                -> Eff (ajax :: AJAX, dom :: DOM | e) Unit

open :: forall e. String
               -> String
               -> Config
               -> String
               -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
               -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
open _ _ _ _ _ = createSingletonTextNodeArray "Please use shortcuts or links."

