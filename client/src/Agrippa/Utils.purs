module Agrippa.Utils (addShortcutLabels, createTextNode, createTaskTableRows, createTaskTableRow, createTuple3, displayOutput, displayOutputText) where

import Prelude (Unit, bind, discard, pure, show, unit, (<>), (>>=), (<$>))
import Data.Argonaut.Core (Json)
import Data.Array (uncons, zipWith, (..))
import Data.Maybe (Maybe(..))
import Data.Either (Either(..))
import Data.Traversable (sequence_, traverse, traverse_)
import Data.Tuple (Tuple, fst, snd)
import Data.Tuple.Nested (Tuple3, get1, get2, get3, tuple3)
import Effect (Effect)
import JQuery (JQuery, addClass, append, appendText, clear, create, select, setText)
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

createTaskTableRows :: Config
                    -> JQuery
                    -> (String -> Boolean)
                    -> (String -> Boolean)
                    -> (String -> Tuple3 String String String)
                    -> (String -> Tuple3 String String String)
                    -> Effect Unit
createTaskTableRows config tableElement keywordFilter taskNameFilter keywordSplitter taskNameSplitter =
  case getKeywordsToTaskNames of
    Left  err -> displayOutputText err
    Right obj -> traverse_
                   (\tp -> createTaskTableRow "<td>" (fst tp) (snd tp) keywordSplitter taskNameSplitter tableElement)
                   (toAscUnfoldable obj :: Array (Tuple String String))
  where
    getKeywordsToTaskNames :: Either String (Object String)
    getKeywordsToTaskNames = do
      keywordsToTaskConfigs <- getObjectVal "tasks" config :: Either String (Object Json)
      keywordsToTaskNames   <- traverse (getStringVal "name") (filterKeys keywordFilter keywordsToTaskConfigs)
      Right (filter taskNameFilter keywordsToTaskNames)

createTaskTableRow :: String
                   -> String
                   -> String
                   -> (String -> Tuple3 String String String)
                   -> (String -> Tuple3 String String String)
                   -> JQuery
                   -> Effect Unit
createTaskTableRow cellType cellData1 cellData2 splitter1 splitter2 tableElement = do
  tr <- create "<tr>"
  createTaskTableCell cellData1 splitter1 tr
  createTaskTableCell cellData2 splitter2 tr
  append tr tableElement
  where createTaskTableCell contents splitter tr = do
          cell <- create cellType
          let tp3 = splitter contents
          appendText (get1 tp3) cell
          span <- create "<span>"
          setText (get2 tp3) span
          addClass "agrippa-highlighted-text" span
          append span cell
          appendText (get3 tp3) cell
          append cell tr

createTuple3 :: String -> Tuple3 String String String
createTuple3 s = tuple3 "" "" s
