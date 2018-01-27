module Agrippa.Help (buildHelp) where

import Prelude (Unit, bind, discard, (*>), (>>=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, display, hide, on, select, setText, toggle)
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.StrMap (StrMap, toAscUnfoldable)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import DOM (DOM)

import Agrippa.Config (Config, getBooleanVal, getStrMapVal, getStringVal, lookupConfigVal)
import Agrippa.Utils (displayOutputText)

buildHelp :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelp config = do
  helpLink		<- select "#agrippa-help-link"
  helpContent <- select "#agrippa-help-content"
  case lookupConfigVal "preferences" config >>= getBooleanVal "showHelpByDefault" of
    Left  err -> displayOutputText err
    Right b   -> if b
                then display helpContent
                else hide helpContent
  buildHelpTextForTasks config
  on "click" (helpLinkHandler helpContent) helpLink

buildHelpTextForTasks :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelpTextForTasks config =
  case getKeywordToTaskName config of
    Left  err -> displayOutputText err
    Right m   -> traverse_ buildHelpTextForTask
                  (toAscUnfoldable m :: Array (Tuple String String))

getKeywordToTaskName :: Config -> Either String (StrMap String)
getKeywordToTaskName config = do
  keywordToTaskConfig <- getStrMapVal "tasks" config
  traverse (getStringVal "name") keywordToTaskConfig

buildHelpTextForTask :: forall e. Tuple String String -> Eff (dom :: DOM | e) Unit
buildHelpTextForTask (Tuple keyword taskDesc) = do
  helpTable <- select "#agrippa-help-table"
  tr <- create "<tr>"
  createTd keyword tr *> createTd taskDesc tr *> append tr helpTable
  where
    createTd :: String -> JQuery -> Eff (dom :: DOM | e) Unit
    createTd contents tr = create "<td>" >>= \td -> setText contents td *> append td tr

helpLinkHandler :: forall e. JQuery
                          -> JQueryEvent
                          -> JQuery
                          -> Eff (dom :: DOM | e) Unit
helpLinkHandler helpContent _ _ = toggle helpContent

