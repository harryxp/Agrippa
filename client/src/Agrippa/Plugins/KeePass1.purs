module Agrippa.Plugins.KeePass1 (keePass1) where

import Prelude (Unit, bind, const, discard, flip, map, pure, show, unit, (*>), (>>=), (<=<), (<<<))
import Affjax (post)
import Affjax.RequestBody as RequestBody
import Affjax.ResponseFormat (json)
import Affjax.StatusCode (StatusCode(..))
import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, fromObject, fromString, toArray, toObject, toString)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.Traversable (traverse, traverse_)
import Effect (Effect)
import Effect.Aff (runAff_)
import Foreign (readString)
import Foreign.Object (Object, empty, insert, lookup)
import JQuery (JQuery, JQueryEvent, append, create, getValue, on, select, setClass, setProp, setText, setValue)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (createTextNode, displayOutputText)

keePass1 :: Plugin
keePass1 = Plugin { name: "KeePass1"
                  , onInputChange: \_ _ _ -> map Just (createTextNode "Searching...")
                  , onInputChangeAfterTimeout: suggest
                  , onActivation: \_ _ _ -> pure Nothing
                  }

suggest :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect Unit
suggest _ _ input displayOutput =
  runAff_ affHandler ((post json "/agrippa/keepass1/suggest" <<< RequestBody.Json <<< buildSuggestReq <<< trim) input)
  where affHandler (Right { status: (StatusCode 200)
                          , body:   (Right resp)
                          }) = buildOutput resp >>= displayOutput
        affHandler _         = pure unit

buildOutput :: Json -> Effect JQuery
buildOutput contents = do
  containerDiv <- create "<div>"
  case (traverse toObject <=< toArray) contents of
    Just entries -> traverse buildEntryUI entries >>= traverse_ (flip append containerDiv)
    Nothing      -> buildUnlockUI containerDiv
  pure containerDiv

buildUnlockUI :: JQuery -> Effect Unit
buildUnlockUI containerDiv = do
  label <- createTextNode "Please input master password to unlock database:"
  append label containerDiv

  inputField <- create "<input>"
  setProp "type" "password" inputField
  setProp "id" "agrippa-keepass1-master-password" inputField
  append inputField containerDiv

  submitButton <- create "<button>"
  setText "Unlock" submitButton
  on "click" unlock submitButton
  append submitButton containerDiv

unlock :: JQueryEvent -> JQuery -> Effect Unit
unlock _ _ = do
  masterPasswordInput <- select "#agrippa-keepass1-master-password"
  foreignInput        <- getValue masterPasswordInput
  case runExcept (readString foreignInput) of
    Left  err -> displayOutputText (show err)
    Right pwd -> runAff_
                   (const (pure unit)) -- TODO fetch entries
                   ((post json "/agrippa/keepass1/unlock" <<< RequestBody.Json <<< buildUnlockReq) pwd)

buildUnlockReq :: String -> Json
buildUnlockReq masterPassword = fromObject (insert "password" (fromString masterPassword) empty)

buildEntryUI :: Object Json -> Effect JQuery
buildEntryUI entry = do
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

foreign import copyButtonListener :: JQueryEvent -> JQuery -> Effect Unit

buildSuggestReq :: String -> Json
buildSuggestReq term = fromObject (insert "term" (fromString term) empty)
