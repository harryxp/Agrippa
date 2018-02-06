module Agrippa.Plugins.FileSystem.Commons (open, suggest) where

import Prelude (Unit, bind, const, discard, flip, map, pure, show, unit, (+), (*>), (<$), (<$>), (<>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, addClass, append, body, create, getProp, on, select, setProp, setText)
import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, fromObject, fromString, toArray, toString)
import Data.Array (cons, drop, take, uncons, zipWith, (..))
import Data.Either (Either(..))
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.StrMap (empty, insert)
import Data.Traversable (sequence, traverse, traverse_)
import DOM (DOM)
import Global (encodeURIComponent)
import Network.HTTP.Affjax (Affjax, AJAX, get, post)

import Agrippa.Config (Config)
import Agrippa.Utils (createTextNode)

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

-- <ctrl-shift-#> shortcuts; not counting <enter>
numOfShortcuts :: Int
numOfShortcuts = 9

buildOutput :: forall e. String
                      -> Json
                      -> Eff (ajax :: AJAX, dom :: DOM | e) JQuery
buildOutput openUrl contents = do
  containerDiv <- create "<div>"

  case (traverse toString <=< toArray) contents of
    Just items ->
      case uncons items of
        Just headAndTail -> do
          firstNode <- buildNode openUrl headAndTail.head
          appendShortcutTip "enter" firstNode
          nodesWithShortcuts <- buildNodesWithShortcuts openUrl (take numOfShortcuts headAndTail.tail)
          otherNodes         <- sequence (buildNode openUrl <$> drop (numOfShortcuts + 1) headAndTail.tail)
          traverse_ (flip append containerDiv) (cons firstNode (nodesWithShortcuts <> otherNodes))
        Nothing -> pure unit
    Nothing    -> do
      setText "Error: expect a JSON array of strings from server." containerDiv

  pure containerDiv

buildNode :: forall e. String
                    -> String
                    -> Eff (dom :: DOM | e) JQuery
buildNode openUrl item = do
  link <- buildLink item openUrl
  div  <- create "<div>"
  append link div
  pure div

buildNodesWithShortcuts :: forall e. String
                                  -> Array String
                                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildNodesWithShortcuts openUrl items = do
  body >>= on "keyup" (shortcutHandler openUrl)
  sequence
    (zipWith
      (\index item -> do
        div <- buildNode openUrl item
        appendShortcutTip ("ctrl+shift+" <> show index) div
        pure div)
     (1 .. numOfShortcuts)
     items)

appendShortcutTip :: forall e. String
                            -> JQuery
                            -> Eff (dom :: DOM | e) Unit
appendShortcutTip label parent = do
  span <- create "<span>"
  addClass "agrippa-shortcut-prompt" span
  setText label span
  append span parent

buildLink :: forall e. String -> String -> Eff (dom :: DOM | e) JQuery
buildLink item openUrl = do
  link <- create "<a>"
  setText item link
  setProp "href" (openUrl <> "?item=" <> encodeURIComponent item) link
  pure link

foreign import shortcutHandler :: forall e. String
                                         -> JQueryEvent
                                         -> JQuery
                                         -> Eff (ajax :: AJAX, dom :: DOM | e) Unit

open :: forall e. String
               -> String
               -> Config
               -> String
               -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
               -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
open openUrl _ _ _ _ = do
  link <- select "#agrippa-output > div > div:first > a"
  foreignUrl <- getProp "href" link
  case runExcept (readString foreignUrl) of
    Left  err -> (map Just <<< createTextNode <<< show) err
    Right url -> Nothing <$
      runAff
        (const (pure unit))
        (const (pure unit))
        (get url :: forall e1. Affjax e1 Unit)

