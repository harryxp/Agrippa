module Agrippa.Help (buildHelp, fillHelpTable) where

import Prelude (Unit, bind, discard, (==), (*>), (>>=))
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Foreign.Object (Object, toAscUnfoldable)
import JQuery (JQuery, JQueryEvent, append, create, getText, on, select, setText, toggle)

import Agrippa.Config (Config, getObjectVal, getStringVal)
import Agrippa.Utils (displayOutputText)

buildHelp :: Config -> Effect Unit
buildHelp config = do
  helpTable <- select "#agrippa-help-table"
  fillHelpTable config helpTable

fillHelpTable :: Config -> JQuery -> Effect Unit
fillHelpTable config helpTable = do
  helpContent <- select "#agrippa-help-content"
  buildHelpTextForTasks

  helpButton  <- select "#agrippa-help-button"
  on "click" (toggleHelp helpContent) helpButton

  closeLink   <- select "#agrippa-help-close"
  on "click" (toggleHelp helpContent) closeLink

  where
    buildHelpTextForTasks :: Effect Unit
    buildHelpTextForTasks =
      case getKeywordsToTaskNames of
        Left  err -> displayOutputText err
        Right m   -> traverse_
                       buildHelpTextForTask
                       (toAscUnfoldable m :: Array (Tuple String String))

    getKeywordsToTaskNames :: Either String (Object String)
    getKeywordsToTaskNames = do
      keywordsToTaskConfigs <- getObjectVal "tasks" config
      traverse (getStringVal "name") keywordsToTaskConfigs

    buildHelpTextForTask :: Tuple String String -> Effect Unit
    buildHelpTextForTask (Tuple keyword taskDesc) = do
      tr <- create "<tr>"
      createTd keyword tr *> createTd taskDesc tr *> append tr helpTable
      where
        createTd :: String -> JQuery -> Effect Unit
        createTd contents tr = create "<td>" >>= \td -> setText contents td *> append td tr

    toggleHelp :: JQuery -> JQueryEvent -> JQuery -> Effect Unit
    toggleHelp helpContent _ _ = do
      toggle helpContent
      helpButton <- select "#agrippa-help-button"
      text       <- getText helpButton
      if text == "What do I do?"
        then setText "Got it!" helpButton
        else setText "What do I do?" helpButton
