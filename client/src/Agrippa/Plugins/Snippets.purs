module Agrippa.Plugins.Snippets (copy, suggest) where

import Prelude (Unit, bind, discard, pure, (<<<))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, append, create, setProp, setText, setValue)
import Data.Argonaut.Core (toString)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, filterKeys, toArrayWithKey)
import Data.String (toLower, trim)
import Data.String.Utils (includes)
import Data.Traversable (sequence)
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
buildOutputNodes candidates = sequence (toArrayWithKey buildOutputNode candidates)

buildOutputNode :: forall e. String -> Config -> Eff (dom :: DOM | e) JQuery
buildOutputNode key value =
  let val = case toString value of
              Nothing -> "Error: snippets must be strings."
              Just s  -> s
  in do
    keySpan <- create "<span>"
    setText key keySpan

    valField <- create "<input>"
    setValue val valField
    -- probably should use the css function but I don't want introduce another eff...
    setProp "style" "width: 40em; background-color: #fdf6e3" valField

    div <- create "<div>"
    append keySpan div
    append valField div
    pure div

copy :: forall e. String
               -> Config
               -> String
               -> (Array JQuery -> Eff (dom :: DOM | e) Unit)
               -> Eff (dom :: DOM | e) (Array JQuery)
copy _ _ _ _ = pure []
