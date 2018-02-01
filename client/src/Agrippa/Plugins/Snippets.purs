module Agrippa.Plugins.Snippets (copy, suggest) where

import Prelude (Unit, bind, discard, flip, pure, (<<<))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, addClass, append, create, on, setText, setValue)
import Data.Argonaut.Core (toString)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, filterKeys, toArrayWithKey)
import Data.String (toLower, trim)
import Data.String.Utils (includes)
import Data.Traversable (sequence, traverse_)
import DOM (DOM)

import Agrippa.Config (Config, getStrMapVal)
import Agrippa.Utils (createSingletonTextNodeArray)

suggest :: forall e. String
                  -> Config
                  -> String
                  -> (Array JQuery -> Eff (dom :: DOM | e) Unit)
                  -> Eff (dom :: DOM | e) (Array JQuery)
suggest _ config input displayOutput =
  case getStrMapVal "snippets" config of
    Left  err            -> createSingletonTextNodeArray err
    Right keywordsToText ->
      let candidates :: StrMap Config
          candidates = filterKeys (includes (toLower (trim input)) <<< toLower) keywordsToText
      in buildOutputNodes candidates

buildOutputNodes :: forall e. StrMap Config -> Eff (dom :: DOM | e) (Array JQuery)
buildOutputNodes candidates =
  let rowsEff :: Eff (dom :: DOM | e) (Array JQuery)
      rowsEff = sequence (toArrayWithKey buildOutputRow candidates)
  in do
    table <- create "<table>"
    rows  <- rowsEff
    traverse_ (flip append table) rows
    pure [table]

buildOutputRow :: forall e. String -> Config -> Eff (dom :: DOM | e) JQuery
buildOutputRow key value =
  let val = case toString value of
              Nothing -> "Error: snippets must be strings."
              Just s  -> s
  in do
    keyCell <- create "<td>"
    setText key keyCell

    copyButton <- create "<button>"
    setText "Copy" copyButton
    on "click" copyButtonHandler copyButton
    buttonCell <- create "<td>"
    append copyButton buttonCell

    valField <- create "<input>"
    setValue val valField
    addClass "agrippa-snippet" valField
    valCell <- create "<td>"
    append valField valCell

    tr <- create "<tr>"
    append keyCell tr
    append buttonCell tr
    append valCell tr
    pure tr

foreign import copyButtonHandler :: forall e. JQueryEvent
                                           -> JQuery
                                           -> Eff (dom :: DOM | e) Unit

copy :: forall e. String
               -> Config
               -> String
               -> (Array JQuery -> Eff (dom :: DOM | e) Unit)
               -> Eff (dom :: DOM | e) (Array JQuery)
copy _ _ _ _ = pure []
