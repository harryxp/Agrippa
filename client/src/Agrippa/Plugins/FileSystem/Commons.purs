module Agrippa.Plugins.FileSystem.Commons (open, suggest) where

import Prelude (Unit, bind, const, discard, flip, map, pure, show, unit, (*>), (<$), (<>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, body, create, getProp, on, select, setProp, setText)
import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, fromObject, fromString, toArray, toString)
import Data.Either (Either(..))
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.StrMap (empty, insert)
import Data.Traversable (traverse, traverse_)
import DOM (DOM)
import Global (encodeURIComponent)
import Network.HTTP.Affjax (AJAX, Affjax, get, post)

import Agrippa.Config (Config)
import Agrippa.Utils (addShortcutLabels, createTextNode)

suggest :: forall e. String
                  -> String
                  -> String
                  -> Config
                  -> String
                  -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
suggest suggestUrl openUrl taskName config input displayOutput =
  runAff
    (const (pure unit))
    (\{ response: r } -> buildOutput openUrl r >>= displayOutput)
    ((post suggestUrl <<< buildSuggestReq taskName <<< trim) input)
  *> map Just (createTextNode "Searching...")

buildSuggestReq :: String -> String -> Json
buildSuggestReq taskName term = (fromObject <<<
                                 insert "taskName" (fromString taskName) <<<
                                 insert "term"     (fromString term)) empty

buildOutput :: forall e. String -> Json -> Eff (ajax :: AJAX, dom :: DOM | e) JQuery
buildOutput openUrl contents = do
  containerDiv <- create "<div>"
  case (traverse toString <=< toArray) contents of
    Just items -> do
      body >>= on "keyup" (shortcutListener openUrl)
      nodes <- traverse (buildNode openUrl) items
      traverse_ (flip append containerDiv) nodes
      addShortcutLabels "<span>" nodes
    Nothing -> do
      setText "Error: expect a JSON array of strings from server." containerDiv
  pure containerDiv

buildNode :: forall e. String -> String -> Eff (dom :: DOM | e) JQuery
buildNode openUrl item = do
  link <- create "<a>"
  setText item link
  setProp "href" (openUrl <> "?item=" <> encodeURIComponent item) link
  div  <- create "<div>"
  append link div
  pure div

open :: forall e. String
               -> String
               -> Config
               -> String
               -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
               -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
open openUrl _ _ _ _ = do
  body >>= on "keyup" (shortcutListener openUrl)
  link <- select "#agrippa-output > div > div:first > a"
  foreignUrl <- getProp "href" link
  case runExcept (readString foreignUrl) of
    Left  err -> (map Just <<< createTextNode <<< show) err
    Right url -> Nothing <$
      runAff
        (const (pure unit))
        (const (pure unit))
        (get url :: forall e1. Affjax e1 Unit)

foreign import shortcutListener :: forall e. String -> JQueryEvent -> JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit

