module Agrippa.Plugins.Snippets (snippets) where

import Prelude (Unit, bind, discard, flip, map, pure, unit, (<<<), (>>=), (*>))
import Data.Argonaut.Core (toString)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (toLower, trim)
import Data.String.Utils (includes)
import Data.Traversable (sequence, traverse_)
import Effect (Effect)
import Foreign.Object (Object, filterKeys, toArrayWithKey)
import JQuery (JQuery, JQueryEvent, addClass, append, body, create, on, setProp, setText, setValue)

import Agrippa.Config (Config, getObjectVal)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (addShortcutLabels, createTextNode)

snippets :: Plugin
snippets = Plugin { name: "Snippets"
                  , onInputChange: suggest
                  , onInputChangeAfterTimeout: \_ _ _ _ -> pure unit
                  , onActivation: copy
                  }

suggest :: String -> Config -> String -> Effect (Maybe JQuery)
suggest _ config input = map Just
  case getObjectVal "snippets" config of
    Left  err            -> createTextNode err
    Right keywordsToText ->
      let candidates :: Object Config
          candidates = filterKeys (includes (toLower (trim input)) <<< toLower) keywordsToText
      in buildTable candidates

buildTable :: Object Config -> Effect JQuery
buildTable candidates = do
  body >>= on "keyup" shortcutListener
  rows  <- sequence (toArrayWithKey buildTableRow candidates) :: Effect (Array JQuery)
  table <- create "<table>"
  traverse_ (flip append table) rows
  addShortcutLabels "<td>" rows
  pure table

buildTableRow :: String -> Config -> Effect JQuery
buildTableRow key value =
  let val = case toString value of
              Nothing -> "Error: snippets must be strings."
              Just s  -> s
  in do
    keyCell <- create "<td>"
    setText key keyCell

    valField <- create "<input>"
    setValue val valField
    addClass "agrippa-snippet" valField
    setProp "readonly" true valField
    valCell <- create "<td>"
    append valField valCell

    copyButton <- create "<button>"
    setText "Copy" copyButton
    on "click" copyButtonListener copyButton
    buttonCell <- create "<td>"
    append copyButton buttonCell

    tr <- create "<tr>"
    append keyCell tr
    append valCell tr
    append buttonCell tr
    pure tr

foreign import shortcutListener :: JQueryEvent -> JQuery -> Effect Unit

foreign import copyButtonListener :: JQueryEvent -> JQuery -> Effect Unit

copy :: String -> Config -> String -> Effect (Maybe JQuery)
copy _ _ _ = (body >>= on "keyup" shortcutListener) *> clickFirstCopyButton *> pure Nothing

foreign import clickFirstCopyButton :: Effect Unit
