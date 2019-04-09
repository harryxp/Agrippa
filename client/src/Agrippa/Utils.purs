module Agrippa.Utils (addShortcutLabels, createTextNode, createTaskTableData, createTaskTableRow, displayOutput, displayOutputText) where

import Prelude (Unit, bind, discard, pure, show, unit, (<>), (>>=), (<$>))
import Data.Argonaut.Core (Json)
import Data.Array (uncons, zipWith, (..))
import Data.Maybe (Maybe(..))
import Data.Either (Either(..))
import Data.Traversable (sequence_, traverse, traverse_)
import Data.Tuple (Tuple, fst, snd)
import Effect (Effect)
import JQuery (JQuery, addClass, append, clear, create, select, setText)
import Foreign.Object (Object, filter, filterKeys, toAscUnfoldable)

import Agrippa.Config (Config, getObjectVal, getStringVal)

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

createTaskTableData :: Config -> JQuery -> (String -> Boolean) -> (String -> Boolean) -> Effect Unit
createTaskTableData config tableElement keywordFilter taskNameFilter =
  case getKeywordsToTaskNames of
    Left  err -> displayOutputText err
    Right obj -> traverse_
                   (\tp -> createTaskTableRow "<td>" (fst tp) (snd tp) tableElement)
                   (toAscUnfoldable obj :: Array (Tuple String String))
  where
    getKeywordsToTaskNames :: Either String (Object String)
    getKeywordsToTaskNames = do
      keywordsToTaskConfigs <- getObjectVal "tasks" config :: Either String (Object Json)
      keywordsToTaskNames   <- traverse (getStringVal "name") (filterKeys keywordFilter keywordsToTaskConfigs)
      Right (filter taskNameFilter keywordsToTaskNames)

createTaskTableRow :: String -> String -> String -> JQuery -> Effect Unit
createTaskTableRow cellType cellData1 cellData2 tableElement = do
  tr <- create "<tr>"
  createTaskTableCell cellData1 tr
  createTaskTableCell cellData2 tr
  append tr tableElement
  where createTaskTableCell contents tr = do
          cell <- create cellType
          setText contents cell
          append cell tr
