module Agrippa.Main (main) where

import Prelude (Unit, bind, discard, flip, pure, show, unit, void, (==), (/=), ($), (*>), (>>=), (<>), (<$>), (&&))
import Control.Alt ((<|>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, body, clear, create, display, getWhich, getValue, hide, off, on, ready, select, setText, toggle)
import Control.Monad.Eff.Now (NOW)
import Control.Monad.Eff.Ref (REF, Ref, newRef, readRef, writeRef)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.Foreign (readString)
import Data.StrMap (StrMap, lookup, toAscUnfoldable)
import Data.String (Pattern(..), indexOf, splitAt)
import Data.Traversable (sequence_, traverse)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config, getBooleanVal, getStrMapVal, getStringVal, lookupConfigVal)
import Agrippa.Plugins.Registry (Plugin(..), pluginsByName)
import Agrippa.Utils (mToE)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM, now :: NOW, ref :: REF, window :: WINDOW | e) Unit
main = ready $
  loadConfig (\config -> buildHelp config *> installInputHandler config)

loadConfig :: forall e. (Config -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                     -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
loadConfig onSuccess = void $
  runAff
    (\_ -> displayOutputText "Failed to retrieve config from server.")
    (\{ response: r } -> onSuccess r)
    (get "/agrippa/config/")

installInputHandler :: forall e. Config
                              -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, ref :: REF, window :: WINDOW | e) Unit
installInputHandler config = do
  inputField   <- select "#agrippa-input"
  prevInputRef <- newRef ""
  on "keyup" (inputHandler config prevInputRef) inputField

-- tasks, input and output

inputHandler :: forall e. Config
                       -> Ref String
                       -> JQueryEvent
                       -> JQuery
                       -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, ref :: REF, window :: WINDOW | e) Unit
inputHandler config prevInputRef event inputField = do
  keyCode      <- getWhich event
  foreignInput <- getValue inputField
  case runExcept (readString foreignInput) of
    Left err         -> displayOutputText (show err)
    Right wholeInput -> do
      prevInput <- readRef prevInputRef
      writeRef prevInputRef wholeInput
      if prevInput == wholeInput && keyCode /= 13
        then pure unit
        else dispatchToTask config keyCode wholeInput

data Task = Task { name   :: String
                 , plugin :: Plugin
                 , input  :: String
                 , config :: Config
                 }

dispatchToTask :: forall e. Config
                         -> Int
                         -> String
                         -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit
dispatchToTask config keyCode wholeInput =
  case findTask config wholeInput <|> findDefaultTask config wholeInput of
    Left err   -> displayOutputText err
    Right task -> (body >>= off "keyup") *> execTask task keyCode

findTask :: Config -> String -> Either String Task
findTask config wholeInput = do
  index                                 <- mToE "No keyword found in input."                            (indexOf (Pattern " ") wholeInput)
  { before: keyword, after: taskInput } <- mToE "Failed to parse input.  This is impossible!"           (splitAt index wholeInput)
  taskConfigsByKeyword                  <- getStrMapVal "tasks" config
  taskConfig                            <- mToE ("Keyword '" <> keyword <> "' not found in config.")    (lookup keyword taskConfigsByKeyword)
  taskName                              <- getStringVal "name" taskConfig
  pluginName                            <- getStringVal "plugin" taskConfig
  plugin                                <- mToE ("Can't find plugin with name '" <> pluginName <> "'.") (lookup pluginName pluginsByName)
  pure (Task { name: taskName, plugin: plugin, input: taskInput, config: taskConfig })

findDefaultTask :: Config -> String -> Either String Task
findDefaultTask config wholeInput = do
  prefs             <- lookupConfigVal "preferences" config
  defaultTaskConfig <- lookupConfigVal "defaultTask" prefs
  taskName          <- getStringVal    "name"        defaultTaskConfig
  pluginName        <- getStringVal    "plugin"      defaultTaskConfig
  plugin            <- mToE ("Can't find plugin with name '" <> pluginName <> "'.") (lookup pluginName pluginsByName)
  pure (Task { name: taskName, plugin: plugin, input: wholeInput, config: defaultTaskConfig })

execTask :: forall e. Task
                   -> Int
                   -> Eff (ajax :: AJAX, dom :: DOM, now :: NOW, window :: WINDOW | e) Unit
execTask (Task { name: name
               , plugin: (Plugin { onInputChange: prompt, onActivation: activate })
               , input: taskInput
               , config: taskConfig
               })
         keyCode = do
  displayTask name
  case keyCode of
    13        -> activate taskConfig taskInput displayOutput >>= displayOutputText
    otherwise -> prompt   taskConfig taskInput displayOutput >>= displayOutputText

displayTask :: forall e. String -> Eff (dom :: DOM | e) Unit
displayTask t = select "#agrippa-task" >>= setText t

displayOutputText :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutputText t = select "#agrippa-output" >>= setText t

displayOutput :: forall e. Array JQuery -> Eff (dom :: DOM | e) Unit
displayOutput nodes = do
  output <- select "#agrippa-output"
  clear output
  sequence_ (flip append output <$> nodes)

-- help

buildHelp :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelp config = do
  helpLink <- select "#agrippa-help-link"
  helpContent <- select "#agrippa-help-content"
  case lookupConfigVal "preferences" config >>= getBooleanVal "showHelpByDefault" of
    Left err -> displayOutputText err
    Right b  -> if b
                then display helpContent
                else hide helpContent
  buildHelpTextForTasks config
  on "click" (helpLinkHandler helpContent) helpLink

buildHelpTextForTasks :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelpTextForTasks config =
  case getTaskNamesByKeyword config of
    Left err -> displayOutputText err
    Right m  -> traverse_ buildHelpTextForTask
                  (toAscUnfoldable m :: Array (Tuple String String))

getTaskNamesByKeyword :: Config -> Either String (StrMap String)
getTaskNamesByKeyword config = do
  taskConfigsByKeyword <- getStrMapVal "tasks" config
  traverse (getStringVal "name") taskConfigsByKeyword

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

