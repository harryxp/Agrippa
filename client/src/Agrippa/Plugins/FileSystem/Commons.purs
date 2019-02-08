module Agrippa.Plugins.FileSystem.Commons (open, prompt, suggest) where

import Prelude (Unit, bind, const, discard, flip, map, pure, show, unit, (<$), (<>), (>>=), (<=<), (<<<))
import Affjax (get, post)
import Affjax.RequestBody as RequestBody
import Affjax.ResponseFormat (json)
import Affjax.StatusCode (StatusCode(..))
import Effect.Aff (runAff, runAff_)
import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, fromObject, fromString, toArray, toString)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.Traversable (traverse, traverse_)
import Effect (Effect)
import Foreign (readString)
import Foreign.Object (empty, insert)
import Global.Unsafe (unsafeEncodeURIComponent)
import JQuery (JQuery, JQueryEvent, append, body, create, getProp, on, select, setProp, setText)

import Agrippa.Config (Config)
import Agrippa.Utils (addShortcutLabels, createTextNode)

suggest :: String -> String -> String -> Config -> String -> (JQuery -> Effect Unit) -> Effect Unit
suggest suggestUrl openUrl taskName config input displayOutput =
  runAff_ affHandler ((post json suggestUrl <<< RequestBody.Json <<< buildSuggestReq taskName <<< trim) input)
  where affHandler (Right { status: (StatusCode 200)
                          , body:   (Right resp)
                          }) = buildOutput openUrl resp >>= displayOutput
        affHandler _         = pure unit

buildSuggestReq :: String -> String -> Json
buildSuggestReq taskName term = (fromObject <<<
                                 insert "taskName" (fromString taskName) <<<
                                 insert "term"     (fromString term)) empty

buildOutput :: String -> Json -> Effect JQuery
buildOutput openUrl contents = do
  containerDiv <- create "<div>"
  case (traverse toString <=< toArray) contents of
    Just items -> do
      body >>= on "keyup" (shortcutListener openUrl)
      nodes <- traverse (buildNode openUrl) items
      traverse_ (flip append containerDiv) nodes
      addShortcutLabels "<span>" nodes
    Nothing -> setText "Error: expect a JSON array of strings from server." containerDiv
  pure containerDiv

buildNode :: String -> String -> Effect JQuery
buildNode openUrl item = do
  link <- create "<a>"
  setText item link
  setProp "href" (openUrl <> "?item=" <> unsafeEncodeURIComponent item) link
  div  <- create "<div>"
  append link div
  pure div

prompt :: String -> Config -> String -> Effect (Maybe JQuery)
prompt _ _ _ = map Just (createTextNode "Searching...")

open :: String -> String -> Config -> String -> Effect (Maybe JQuery)
open openUrl _ _ _ = do
  body >>= on "keyup" (shortcutListener openUrl)
  link <- select "#agrippa-output > div > div:first > a"
  foreignUrl <- getProp "href" link
  case runExcept (readString foreignUrl) of
    Left  err -> (map Just <<< createTextNode <<< show) err
    Right url -> Nothing <$
      runAff (const (pure unit)) (get json url)

foreign import shortcutListener :: String -> JQueryEvent -> JQuery -> Effect Unit

