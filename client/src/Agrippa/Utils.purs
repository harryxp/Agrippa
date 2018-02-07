module Agrippa.Utils (addShortcutLabels, createTextNode, displayOutput, displayOutputText, mToE) where

import Prelude (Unit, bind, discard, pure, show, unit, (<>), (>>=), (<$>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, addClass, append, clear, create, select, setText)
import Data.Array (uncons, zipWith, (..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Traversable (sequence_)
import DOM (DOM)

displayOutput :: forall e. JQuery -> Eff (dom :: DOM | e) Unit
displayOutput node = do
  output <- select "#agrippa-output"
  clear output
  append node output

displayOutputText :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutputText t = createTextNode t >>= displayOutput

createTextNode :: forall e. String -> Eff (dom :: DOM | e) JQuery
createTextNode t = do
  div <- create "<div>"
  setText t div
  pure div

-- <ctrl-shift-#> shortcuts; not counting <enter>
numOfShortcuts :: Int
numOfShortcuts = 9

addShortcutLabels :: forall e. String -> Array JQuery -> Eff (dom :: DOM | e) Unit
addShortcutLabels htmlTag nodes =
  case uncons nodes of
    Just headAndTail -> do
      appendShortcutLabel htmlTag "enter" headAndTail.head
      sequence_ (zipWith
                  (appendShortcutLabel htmlTag)
                  ((\index -> "ctrl+shift+" <> show index) <$> (1 .. numOfShortcuts))
                  headAndTail.tail)
    Nothing -> pure unit

appendShortcutLabel :: forall e. String -> String -> JQuery -> Eff (dom :: DOM | e) Unit
appendShortcutLabel htmlTag label parent = do
  span <- create htmlTag
  addClass "agrippa-shortcut-prompt" span
  setText label span
  append span parent

mToE :: forall a e. e -> Maybe a -> Either e a
mToE err Nothing = Left  err
mToE _ (Just x)  = Right x

