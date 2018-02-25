module Agrippa.Help (buildHelp) where

import Prelude (Unit, bind, discard, (==), (*>), (>>=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, getText, on, select, setText, toggle)
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.StrMap (StrMap, toAscUnfoldable)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import DOM (DOM)

import Agrippa.Config (Config, getStrMapVal, getStringVal)
import Agrippa.Utils (displayOutputText)

buildHelp :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelp config = do
  helpContent <- select "#agrippa-help-content"
  buildHelpTextForTasks config

  helpButton  <- select "#agrippa-help-button"
  on "click" (helpButtonListener helpContent) helpButton

buildHelpTextForTasks :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelpTextForTasks config =
  case getKeywordsToTaskNames config of
    Left  err -> displayOutputText err
    Right m   -> traverse_ buildHelpTextForTask
                  (toAscUnfoldable m :: Array (Tuple String String))

getKeywordsToTaskNames :: Config -> Either String (StrMap String)
getKeywordsToTaskNames config = do
  keywordsToTaskConfigs <- getStrMapVal "tasks" config
  traverse (getStringVal "name") keywordsToTaskConfigs

buildHelpTextForTask :: forall e. Tuple String String -> Eff (dom :: DOM | e) Unit
buildHelpTextForTask (Tuple keyword taskDesc) = do
  helpTable <- select "#agrippa-help-table"
  tr <- create "<tr>"
  createTd keyword tr *> createTd taskDesc tr *> append tr helpTable
  where
    createTd :: String -> JQuery -> Eff (dom :: DOM | e) Unit
    createTd contents tr = create "<td>" >>= \td -> setText contents td *> append td tr

helpButtonListener :: forall e. JQuery
                             -> JQueryEvent
                             -> JQuery
                             -> Eff (dom :: DOM | e) Unit
helpButtonListener helpContent _ helpButton = do
  toggle helpContent
  text <- getText helpButton
  if text == "What do I do?"
    then setText "Got it!" helpButton
    else setText "What do I do?" helpButton

