module Agrippa.Help (createHelp) where

import Prelude (Unit, bind, const, discard, (==))
import Effect (Effect)
import JQuery (JQuery, JQueryEvent, getText, on, select, setText, toggle)

import Agrippa.Config (Config)
import Agrippa.Utils (createTaskTableRows, createTaskTableRow, createTuple3)

createHelp :: Config -> Effect Unit
createHelp config = do
  helpTable <- select "#agrippa-help-table"
  createTaskTableRow "<th>" "Keyword" "Task" createTuple3 createTuple3 helpTable
  createTaskTableRows config helpTable (const true) (const true) createTuple3 createTuple3

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
