module Agrippa.Main (main) where

import Prelude (Unit, bind, discard, pure, show, void, ($), (*>), (>>=), (<>))
import Control.Alt ((<|>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, display, getWhich, getValue, hide, on, ready, select, setText, toggle)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Data.Either (Either(..))
import Data.FoldableWithIndex (traverseWithIndex_)
import Data.Foreign (readString)
import Data.StrMap (StrMap, lookup)
import Data.String (Pattern(..), indexOf, splitAt)
import Data.Traversable (traverse)
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config, getBooleanVal, getStrMapVal, getStringVal, getConfigVal)
import Agrippa.Plugins.Registry (Plugin(..), pluginsByName)
import Agrippa.Utils (mToE)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
main = ready $
  loadConfig (\config -> buildHelp config *> installInputListener config)

loadConfig :: forall e. (Config -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                     -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
loadConfig onSuccess = void $
  runAff
    (\_ -> displayOutput "Failed to retrieve config from server.")
    (\{ response: r } -> onSuccess r)
    (get "/agrippa/config/")

installInputListener :: forall e. Config
                               -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
installInputListener config = select "#agrippa-input" >>= on "keyup" (inputListener config)

-- tasks, input and output

inputListener :: forall e. Config
                        -> JQueryEvent
                        -> JQuery
                        -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
inputListener config event inputField = do
  keyCode <- getWhich event
  foreignInput <- getValue inputField
  case runExcept (readString foreignInput) of
    Left err         -> displayOutput (show err)
    Right wholeInput -> dispatchToTask config keyCode wholeInput

data Task = Task { name   :: String
                 , plugin :: Plugin
                 , input  :: String
                 , config :: Config
                 }

dispatchToTask :: forall e. Config
                         -> Int
                         -> String
                         -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
dispatchToTask config keyCode wholeInput =
  case findTask config wholeInput <|> findDefaultTask config wholeInput of
    Left err   -> displayOutput err
    Right task -> execTask task keyCode

findTask :: Config -> String -> Either String Task
findTask config wholeInput = do
  index                                 <- mToE "No keyword found in input."                            (indexOf (Pattern " ") wholeInput)
  { before: keyword, after: taskInput } <- mToE "Failed to parse input.  This is impossible!"           (splitAt index wholeInput)
  taskConfigsByKeyword                  <- getStrMapVal "tasks" config
  taskConfig                            <- mToE ("Keyword '" <> keyword <> "' not found in config.")    (lookup keyword taskConfigsByKeyword)
  taskName                              <- getStringVal "name" taskConfig
  pluginName                            <- getStringVal "plugin" taskConfig
  plugin                                <- mToE ("Can't find plugin with name '" <> pluginName <> "'.") (lookup pluginName pluginsByName)
  pure (Task {name: taskName, plugin: plugin, input: taskInput, config: taskConfig})

findDefaultTask :: Config -> String -> Either String Task
findDefaultTask config wholeInput = do
  prefs             <- getConfigVal "preferences" config
  defaultTaskConfig <- getConfigVal "defaultTask" prefs
  taskName          <- getStringVal "name" defaultTaskConfig
  pluginName        <- getStringVal "plugin" defaultTaskConfig
  plugin            <- mToE ("Can't find plugin with name '" <> pluginName <> "'.") (lookup pluginName pluginsByName)
  pure (Task {name: taskName, plugin: plugin, input: wholeInput, config: defaultTaskConfig})

execTask :: forall e. Task
                   -> Int
                   -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
execTask (Task { name: name
               , plugin: (Plugin { onIncrementalChange: inc, onActivation: act })
               , input: taskInput
               , config: taskConfig
               })
         keyCode = do
  displayTask name
  case keyCode of
    13 -> act taskConfig taskInput displayOutput >>= displayOutput -- activation
    otherwise -> displayOutput (inc taskConfig taskInput)          -- incremental

displayTask :: forall e. String -> Eff (dom :: DOM | e) Unit
displayTask t = select "#agrippa-task" >>= setText t

displayOutput :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutput t = select "#agrippa-output" >>= setText t

clearOutput :: forall e. Eff (dom :: DOM | e) Unit
clearOutput = select "#agrippa-output" >>= setText ""

-- help

buildHelp :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelp config = do
  helpLink <- select "#agrippa-help-link"
  helpContent <- select "#agrippa-help-content"
  case getConfigVal "preferences" config >>= getBooleanVal "showHelpByDefault" of
    Left err -> displayOutput err
    Right b  -> if b
                then display helpContent
                else hide helpContent
  buildHelpTextForTasks config
  on "click" (helpLinkListener helpContent) helpLink

buildHelpTextForTasks :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelpTextForTasks config =
  case getTaskNamesByKeyword config of
    Left err -> displayOutput err
    Right m  -> traverseWithIndex_ buildHelpTextForTask m

getTaskNamesByKeyword :: Config -> Either String (StrMap String)
getTaskNamesByKeyword config = do
  taskConfigsByKeyword <- getStrMapVal "tasks" config
  traverse (getStringVal "name") taskConfigsByKeyword

buildHelpTextForTask :: forall e. String -> String -> Eff (dom :: DOM | e) Unit
buildHelpTextForTask keyword taskDesc = do
  helpTable <- select "#agrippa-help-table"
  tr <- create "<tr>"
  createTd keyword tr *> createTd taskDesc tr *> append tr helpTable
  where
    createTd :: String -> JQuery -> Eff (dom :: DOM | e) Unit
    createTd txt tr = create "<td>" >>= \td -> setText txt td *> append td tr

helpLinkListener :: forall e. JQuery
                           -> JQueryEvent
                           -> JQuery
                           -> Eff (dom :: DOM | e) Unit
helpLinkListener helpContent _ _ = toggle helpContent

