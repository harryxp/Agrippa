module Agrippa.Plugins.KeePass1 (suggest) where

import Prelude (Unit, bind, const, discard, flip, map, pure, unit, (*>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, on, setClass, setProp, setText, setValue)
import Data.Argonaut.Core (JObject, Json, fromObject, fromString, toArray, toObject, toString)
import Data.Maybe (Maybe(..))
import Data.StrMap (empty, insert, lookup)
import Data.String (trim)
import Data.Traversable (traverse, traverse_)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config)
import Agrippa.Utils (createTextNode)

suggest :: forall e. String
                  -> Config
                  -> String
                  -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
suggest _ _ input displayOutput =
  runAff
    (const (pure unit))
    (\{ response: r } -> buildOutput r >>= displayOutput)
    ((post "/agrippa/keepass1/suggest" <<< buildSuggestReq <<< trim) input)
  *> map Just (createTextNode "Searching...")

buildOutput :: forall e. Json -> Eff (dom :: DOM | e) JQuery
buildOutput contents = do
  containerDiv <- create "<div>"
  case (traverse toObject <=< toArray) contents of
    Just entries -> traverse buildOutputForEntry entries >>= traverse_ (flip append containerDiv)
    Nothing      -> setText "Error: expect a JSON array of strings from server." containerDiv
  pure containerDiv

buildOutputForEntry :: forall e. JObject -> Eff (dom :: DOM | e) JQuery
buildOutputForEntry entry = do
  entryDiv <- create "<div>"
  appendDiv "Title" entryDiv
  appendDiv "URL"   entryDiv
  _        <- appendTextField "UserName" entryDiv
  pwdField <- appendTextField "Password" entryDiv
  setClass "agrippa-keepass1-password" true pwdField
  appendPre "Comment" entryDiv
  hr       <- create "<hr>"
  append hr entryDiv
  pure entryDiv
  where
    appendDiv fieldName entryDiv =
      case lookup fieldName entry >>= toString of
        Just fieldValue -> createTextNode fieldValue >>= flip append entryDiv
        Nothing         -> pure unit

    appendTextField fieldName entryDiv = do
      label <- create "<span>"
      setText fieldName label
      append label entryDiv

      input <- create "<input>"
      setProp "readonly" true input
      append input entryDiv

      copyButton <- create "<button>"
      setText "Copy" copyButton
      on "click" copyButtonListener copyButton
      append copyButton entryDiv

      case lookup fieldName entry >>= toString of
        Just fieldValue -> setValue fieldValue input
        Nothing         -> pure unit

      pure input

    appendPre fieldName entryDiv =
      case lookup fieldName entry >>= toString of
        Just fieldValue -> do
          pre <- create "<pre>"
          setText fieldValue pre
          append pre entryDiv
        Nothing         -> pure unit

foreign import copyButtonListener :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit

buildSuggestReq :: String -> Json
buildSuggestReq term = fromObject (insert "term" (fromString term) empty)
