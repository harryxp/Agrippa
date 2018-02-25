module Agrippa.Plugins.Snippets (copy, suggest) where

import Prelude (Unit, bind, discard, flip, map, pure, (<<<), (>>=), (*>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, addClass, append, body, create, on, setText, setValue)
import Data.Argonaut.Core (toString)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, filterKeys, toArrayWithKey)
import Data.String (toLower, trim)
import Data.String.Utils (includes)
import Data.Traversable (sequence, traverse_)
import DOM (DOM)

import Agrippa.Config (Config, getStrMapVal)
import Agrippa.Utils (addShortcutLabels, createTextNode)

suggest :: forall e. String
                  -> Config
                  -> String
                  -> (JQuery -> Eff (dom :: DOM | e) Unit)
                  -> Eff (dom :: DOM | e) (Maybe JQuery)
suggest _ config input displayOutput = map Just
  case getStrMapVal "snippets" config of
    Left  err            -> createTextNode err
    Right keywordsToText ->
      let candidates :: StrMap Config
          candidates = filterKeys (includes (toLower (trim input)) <<< toLower) keywordsToText
      in buildTable candidates

buildTable :: forall e. StrMap Config -> Eff (dom :: DOM | e) JQuery
buildTable candidates = do
  body >>= on "keyup" shortcutListener
  rows  <- sequence (toArrayWithKey buildTableRow candidates) :: Eff (dom :: DOM | e) (Array JQuery)
  table <- create "<table>"
  traverse_ (flip append table) rows
  addShortcutLabels "<td>" rows
  pure table

buildTableRow :: forall e. String -> Config -> Eff (dom :: DOM | e) JQuery
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

foreign import shortcutListener :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit

foreign import copyButtonListener :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit

copy :: forall e. String
               -> Config
               -> String
               -> (JQuery -> Eff (dom :: DOM | e) Unit)
               -> Eff (dom :: DOM | e) (Maybe JQuery)
copy _ _ _ _ = (body >>= on "keyup" shortcutListener) *> clickFirstCopyButton *> pure Nothing

foreign import clickFirstCopyButton :: forall e. Eff (dom :: DOM | e) Unit
