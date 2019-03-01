module Agrippa.Help (createHelp, createTaskTableData, createTaskTableRow) where

import Prelude (Unit, bind, const, discard, (==), (<>))
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.Traversable (traverse)
import Data.Tuple (Tuple, fst, snd)
import Effect (Effect)
import Foreign.Object (Object, filterKeys, toAscUnfoldable)
import JQuery (JQuery, JQueryEvent, append, create, getText, on, select, setText, toggle)

import Agrippa.Config (Config, getObjectVal, getStringVal)
import Agrippa.Utils (displayOutputText)

createHelp :: Config -> Effect Unit
createHelp config = do
  helpTable <- select "#agrippa-help-table"
  createTaskTableRow "<th>" "Keyword (followed by <SPACE>)" "Task" helpTable
  createTaskTableData config helpTable (const true)

  helpContent <- select "#agrippa-help-content"
  helpButton  <- select "#agrippa-help-button"
  on "click" (toggleHelp helpContent) helpButton
  closeLink   <- select "#agrippa-help-close"
  on "click" (toggleHelp helpContent) closeLink

  where
    toggleHelp :: JQuery -> JQueryEvent -> JQuery -> Effect Unit
    toggleHelp helpContent _ _ = do
      toggle helpContent
      helpButton <- select "#agrippa-help-button"
      text       <- getText helpButton
      if text == "What do I do?"
        then setText "Got it!" helpButton
        else setText "What do I do?" helpButton

createTaskTableData :: Config -> JQuery -> (String -> Boolean) -> Effect Unit
createTaskTableData config tableElement keywordFilter =
  case getKeywordsToTaskNames of
    Left  err -> displayOutputText err
    Right obj -> traverse_
                   (\tp -> createTaskTableRow "<td>" ((fst tp) <> "<SPACE>") (snd tp) tableElement)
                   (toAscUnfoldable obj :: Array (Tuple String String))
  where
    getKeywordsToTaskNames :: Either String (Object String)
    getKeywordsToTaskNames = do
      keywordsToTaskConfigs <- getObjectVal "tasks" config
      traverse (getStringVal "name") (filterKeys keywordFilter keywordsToTaskConfigs)

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
