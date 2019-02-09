module Agrippa.Utils (addShortcutLabels, createTextNode, displayOutput, displayOutputText, mToE) where

import Prelude (Unit, bind, discard, pure, show, unit, (<>), (>>=), (<$>))
import Data.Array (uncons, zipWith, (..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (sequence_)
import Effect (Effect)
import JQuery (JQuery, addClass, append, clear, create, select, setText)

displayOutput :: JQuery -> Effect Unit
displayOutput node = do
  output <- select "#agrippa-output"
  clear output
  append node output

displayOutputText :: String -> Effect Unit
displayOutputText t = createTextNode t >>= displayOutput

createTextNode :: String -> Effect JQuery
createTextNode t = do
  div <- create "<div>"
  setText t div
  pure div

-- <ctrl-shift-#> shortcuts; not counting <enter>
numOfShortcuts :: Int
numOfShortcuts = 9

addShortcutLabels :: String -> Array JQuery -> Effect Unit
addShortcutLabels htmlTag nodes =
  case uncons nodes of
    Just headAndTail -> do
      appendShortcutLabel htmlTag "enter" headAndTail.head
      sequence_ (zipWith
                  (appendShortcutLabel htmlTag)
                  ((\index -> "ctrl+shift+" <> show index) <$> (1 .. numOfShortcuts))
                  headAndTail.tail)
    Nothing -> pure unit

appendShortcutLabel :: String -> String -> JQuery -> Effect Unit
appendShortcutLabel htmlTag label parent = do
  span <- create htmlTag
  addClass "agrippa-shortcut-prompt" span
  setText label span
  append span parent

mToE :: forall a e. e -> Maybe a -> Either e a
mToE err mb = maybe (Left err) (Right) mb
