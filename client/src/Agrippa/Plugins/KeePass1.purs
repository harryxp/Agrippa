module Agrippa.Plugins.KeePass1 (keePass1) where

import Prelude (Unit, bind, const, discard, flip, map, pure, show, unit, void, ($), (*>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Except (runExcept)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, getValue, on, select, setClass, setProp, setText, setValue)
import Data.Argonaut.Core (JObject, Json, fromObject, fromString, toArray, toObject, toString)
import Data.Either (Either(..))
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.StrMap (empty, insert, lookup)
import Data.String (trim)
import Data.Traversable (traverse, traverse_)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, Affjax, post)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (createTextNode, displayOutputText)

keePass1 :: Plugin
keePass1 = Plugin { name: "KeePass1"
                  , onInputChange: suggest
                  , onActivation: \_ _ _ _ -> pure Nothing
                  }

suggest :: forall e. String
                  -> Config
                  -> String
                  -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
suggest _ _ input displayOutput =
  runAff affHandler ((post "/agrippa/keepass1/suggest" <<< buildSuggestReq <<< trim) input)
  *> map Just (createTextNode "Searching...")
  where affHandler (Left _)                = pure unit
        affHandler (Right { response: r }) = buildOutput r >>= displayOutput

buildOutput :: forall e. Json -> Eff (ajax :: AJAX, dom :: DOM | e) JQuery
buildOutput contents = do
  containerDiv <- create "<div>"
  case (traverse toObject <=< toArray) contents of
    Just entries -> traverse buildUIForEntry entries >>= traverse_ (flip append containerDiv)
    Nothing      -> buildUnlockUI containerDiv
  pure containerDiv

buildUnlockUI :: forall e. JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
buildUnlockUI containerDiv = do
  label <- createTextNode "Please input master password to unlock database:"
  append label containerDiv

  input <- create "<input>"
  setProp "type" "password" input
  setProp "id" "agrippa-keepass1-master-password" input
  append input containerDiv

  submitButton <- create "<button>"
  on "click" submitButtonListener submitButton
  setText "Unlock" submitButton
  append submitButton containerDiv

submitButtonListener :: forall e. JQueryEvent -> JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
submitButtonListener _ _ = do
  masterPasswordInput <- select "#agrippa-keepass1-master-password"
  foreignInput        <- getValue masterPasswordInput
  case runExcept (readString foreignInput) of
    Left  err -> displayOutputText (show err)
    Right pwd -> void $ runAff
                          (const (pure unit)) -- TODO fetch entries
                          ((post "/agrippa/keepass1/unlock" <<< buildUnlockReq) pwd :: forall e1. Affjax e1 Unit)

buildUnlockReq :: String -> Json
buildUnlockReq masterPassword = fromObject (insert "password" (fromString masterPassword) empty)

buildUIForEntry :: forall e. JObject -> Eff (dom :: DOM | e) JQuery
buildUIForEntry entry = do
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
