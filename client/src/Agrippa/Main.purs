module Agrippa.Main (main) where

import Prelude (Unit, bind, const, discard, pure, show, unit, (==), (/=), (>>=), (<>), (&&))
import Affjax (get)
import Affjax.ResponseFormat (ignore, json)
import Affjax.StatusCode (StatusCode(..))
import Control.Monad.Except (runExcept)
import Data.Either (Either(..), hush)
import Data.Int (ceil)
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe')
import Data.String (Pattern(..), indexOf, splitAt)
import Data.String.Utils (startsWith)
import Effect (Effect)
import Effect.Aff (runAff_)
import Effect.Ref (Ref, new, read, write)
import Effect.Timer (TimeoutId, clearTimeout, setTimeout)
import Foreign (readString)
import Foreign.Object (lookup)
import JQuery (JQuery, JQueryEvent, body, create, getWhich, getValue, off, on, ready, select, setText)

import Agrippa.Config (Config, getNumberVal, getObjectVal, getStringVal, lookupConfigVal)
import Agrippa.Help (createHelp)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Plugins.Registry (namesToPlugins)
import Agrippa.Utils (createTaskTableRows, createTaskTableRow, displayOutput, displayOutputText)

main :: Effect Unit
main = ready (runAff_ affHandler (get json "/agrippa/config/"))
  where affHandler (Right { status: (StatusCode 200)
                          , body:   (Right config)
                          }) = do
          createHelp config
          timeoutIdRefMb <- new Nothing
          installInputListener config timeoutIdRefMb
          installRestartServerListener
          handleNoSelectedTask config Nothing "" timeoutIdRefMb
        affHandler _         = displayOutputText "Failed to retrieve config from server."

installInputListener :: Config -> Ref (Maybe TimeoutId) -> Effect Unit
installInputListener config timeoutIdRefMb = do
  inputField   <- select "#agrippa-input"
  prevInputRef <- new ""
  on "keyup" (inputListener config prevInputRef timeoutIdRefMb) inputField

installRestartServerListener :: Effect Unit
installRestartServerListener = do
  button <- select "#agrippa-restart-button"
  on "click"
     (\_ _ -> runAff_
                (\_ -> displayOutputText "Restarting server... Please reload or visit the new address if that has been changed.")
                (get ignore "/agrippa/restart/"))
     button

-- tasks, input and output

inputListener :: Config -> Ref String -> Ref (Maybe TimeoutId) ->JQueryEvent -> JQuery -> Effect Unit
inputListener config prevInputRef timeoutIdRefMb event inputField = do
  keyCode      <- getWhich event
  foreignInput <- getValue inputField
  case runExcept (readString foreignInput) of
    Left  err        -> displayOutputText (show err)
    Right wholeInput -> do
      prevInput <- read prevInputRef
      write wholeInput prevInputRef
      if prevInput == wholeInput && keyCode /= 13
        -- do nothing if the input remained the same
        -- and the key pressed was not enter
        then pure unit
        else handleInput config keyCode wholeInput timeoutIdRefMb

data Task = Task { name   :: String
                 , plugin :: Plugin
                 , input  :: String
                 , config :: Config
                 }

handleInput :: Config -> Int -> String -> Ref (Maybe TimeoutId) -> Effect Unit
handleInput config keyCode wholeInput timeoutIdRefMb = do
  -- clear keyup event listeners on body placed by plugins, if any
  body >>= off "keyup"
  case findTask config wholeInput of
    Just task@Task { name: taskName } -> do
      displaySelectedTask taskName
      execTask task keyCode timeoutIdRefMb
    Nothing                           -> handleNoSelectedTask config (Just keyCode) wholeInput timeoutIdRefMb

-- Extract keyword from input then find task based on that.
findTask :: Config -> String -> Maybe Task
findTask config wholeInput = do
  index                                 <- indexOf (Pattern " ") wholeInput
  { before: keyword, after: taskInput } <- Just (splitAt index wholeInput)
  keywordsToTaskConfigs                 <- hush (getObjectVal "tasks" config)
  taskConfig                            <- lookup keyword keywordsToTaskConfigs
  taskName                              <- hush (getStringVal "name" taskConfig)
  pluginName                            <- hush (getStringVal "plugin" taskConfig)
  plugin                                <- Map.lookup pluginName namesToPlugins
  Just (Task { name: taskName, plugin: plugin, input: taskInput, config: taskConfig })

handleNoSelectedTask :: Config -> Maybe Int -> String -> Ref (Maybe TimeoutId) -> Effect Unit
handleNoSelectedTask config keyCodeMb wholeInput timeoutIdRefMb =
  case findDefaultTask of
    Just defaultTask@Task { name: taskName } -> do
      displayTaskCandidates config wholeInput ("  Press <ENTER> to activate the default task - " <> taskName <> ".")
      case keyCodeMb of
        Just 13 -> execTask defaultTask 13 timeoutIdRefMb
        _       -> pure unit
    Nothing                                  -> displayTaskCandidates config wholeInput ""
  where
  findDefaultTask :: Maybe Task
  findDefaultTask = do
    prefs             <- hush (lookupConfigVal "preferences" config)
    defaultTaskConfig <- hush (lookupConfigVal "defaultTask" prefs)
    taskName          <- hush (getStringVal    "name"        defaultTaskConfig)
    pluginName        <- hush (getStringVal    "plugin"      defaultTaskConfig)
    plugin            <- Map.lookup pluginName namesToPlugins
    Just (Task { name: taskName, plugin: plugin, input: wholeInput, config: defaultTaskConfig })

execTask :: Task -> Int -> Ref (Maybe TimeoutId) -> Effect Unit
execTask (Task { name: taskName
               , plugin: (Plugin { prompt: prompt
                                 , promptAfterKeyTimeout: promptAfterKeyTimeout
                                 , activate: activate
                                 })
               , input: taskInput
               , config: taskConfig
               })
         keyCode
         timeoutIdRefMb = do
  nodeMb <- case keyCode of
    13 -> activate taskName taskConfig taskInput
    _  -> do setupPromptAfterKeyTimeout taskConfig (promptAfterKeyTimeout taskName taskConfig taskInput displayOutput) timeoutIdRefMb
             prompt taskName taskConfig taskInput
  maybe' pure displayOutput nodeMb

setupPromptAfterKeyTimeout :: Config -> Effect Unit -> Ref (Maybe TimeoutId) -> Effect Unit
setupPromptAfterKeyTimeout taskConfig promptAfterKeyTimeout timeoutIdRefMb = do
  timeoutIdMb <- read timeoutIdRefMb
  maybe' pure clearTimeout timeoutIdMb

  let taskKeyTimeoutE = getNumberVal "keyTimeoutInMs" taskConfig
      taskKeyTimeout = case taskKeyTimeoutE of
        Left  _       -> 0
        Right timeout -> ceil timeout

  newTimeoutId <- setTimeout taskKeyTimeout promptAfterKeyTimeout
  write (Just newTimeoutId) timeoutIdRefMb

displayTaskCandidates :: Config -> String -> String -> Effect Unit
displayTaskCandidates config wholeInput taskPromptTail = do
  candidateTable <- create "<table>"
  createTaskTableRow "<th>" "Keyword" "Task" candidateTable
  createTaskTableRows config candidateTable (\key -> startsWith wholeInput key) (const true)
  displayOutput candidateTable
  displaySelectedTask ("Showing task candidates." <> taskPromptTail)

displaySelectedTask :: String -> Effect Unit
displaySelectedTask t = select "#agrippa-task" >>= setText t
