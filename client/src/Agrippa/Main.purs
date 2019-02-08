module Agrippa.Main (main) where

import Prelude (Unit, bind, discard, pure, show, unit, (==), (/=), (*>), (>>=), (<>), (&&))
import Affjax (get)
import Affjax.ResponseFormat (ignore, json)
import Affjax.StatusCode (StatusCode(..))
import Control.Alt ((<|>))
import Control.Monad.Except (runExcept)
import Data.Either (Either(..))
import Data.Int (ceil)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), indexOf, splitAt)
import Effect (Effect)
import Effect.Aff (runAff_)
import Effect.Ref (Ref, new, read, write)
import Effect.Timer (TimeoutId, clearTimeout, setTimeout)
import Foreign (readString)
import Foreign.Object (lookup)
import JQuery (JQuery, JQueryEvent, body, getWhich, getValue, off, on, ready, select, setText)

import Agrippa.Config (Config, getNumberVal, getObjectVal, getStringVal, lookupConfigVal)
import Agrippa.Help (buildHelp)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Plugins.Registry (namesToPlugins)
import Agrippa.Utils (displayOutput, displayOutputText, mToE)

main :: Effect Unit
main = ready (runAff_ affHandler (get json "/agrippa/config/"))
  where affHandler (Right { status: (StatusCode 200)
                          , body:   (Right config)
                          }) = do
          buildHelp config
          installInputListener config
          installRestartServerListener
        affHandler _         = displayOutputText "Failed to retrieve config from server."

installInputListener :: Config -> Effect Unit
installInputListener config = do
  inputField   <- select "#agrippa-input"
  prevInputRef <- new ""
  timeoutIdRefMb <- new Nothing
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
        then pure unit
        else dispatchToTask config keyCode wholeInput timeoutIdRefMb

data Task = Task { name   :: String
                 , plugin :: Plugin
                 , input  :: String
                 , config :: Config
                 }

dispatchToTask :: Config -> Int -> String -> Ref (Maybe TimeoutId) -> Effect Unit
dispatchToTask config keyCode wholeInput timeoutIdRefMb =
  case findTask config wholeInput <|> findDefaultTask config wholeInput of
    Left  err  -> displayOutputText err
    Right task -> (body >>= off "keyup") *> execTask task keyCode timeoutIdRefMb

findTask :: Config -> String -> Either String Task
findTask config wholeInput = do
  index                                 <- mToE "No keyword found in input."                            (indexOf (Pattern " ") wholeInput)
  { before: keyword, after: taskInput } <- pure                                                         (splitAt index wholeInput)
  keywordsToTaskConfigs                 <- getObjectVal "tasks" config
  taskConfig                            <- mToE ("Keyword '" <> keyword <> "' not found in config.")    (lookup keyword keywordsToTaskConfigs)
  taskName                              <- getStringVal "name" taskConfig
  pluginName                            <- getStringVal "plugin" taskConfig
  plugin                                <- mToE ("Can't find plugin with name '" <> pluginName <> "'.") (Map.lookup pluginName namesToPlugins)
  pure (Task { name: taskName, plugin: plugin, input: taskInput, config: taskConfig })

findDefaultTask :: Config -> String -> Either String Task
findDefaultTask config wholeInput = do
  prefs             <- lookupConfigVal "preferences" config
  defaultTaskConfig <- lookupConfigVal "defaultTask" prefs
  taskName          <- getStringVal    "name"        defaultTaskConfig
  pluginName        <- getStringVal    "plugin"      defaultTaskConfig
  plugin            <- mToE ("Can't find plugin with name '" <> pluginName <> "'.") (Map.lookup pluginName namesToPlugins)
  pure (Task { name: taskName, plugin: plugin, input: wholeInput, config: defaultTaskConfig })

execTask :: Task -> Int -> Ref (Maybe TimeoutId) -> Effect Unit
execTask (Task { name: taskName
               , plugin: (Plugin { onInputChange: prompt, onActivation: activate })
               , input: taskInput
               , config: taskConfig
               })
         keyCode
         timeoutIdRefMb = do
  displayTask taskName
  timeoutIdMb <- read timeoutIdRefMb
  case timeoutIdMb of
    Just timeoutId -> clearTimeout timeoutId
    Nothing        -> pure unit

  let taskKeyTimeoutE = getNumberVal "keyTimeoutInMs" taskConfig
      promptAction = prompt taskName taskConfig taskInput displayOutput
      taskAction = if keyCode == 13
                   then activate taskName taskConfig taskInput displayOutput
                   else case taskKeyTimeoutE of
                         Left  _              -> promptAction
                         Right taskKeyTimeout -> do
                           newTimeoutId <- setTimeout (ceil taskKeyTimeout) (promptAction *> pure unit)
                           write (Just newTimeoutId) timeoutIdRefMb
                           pure Nothing

  nodeMb <- taskAction
  case nodeMb of
    Just node -> displayOutput node
    Nothing   -> pure unit

displayTask :: String -> Effect Unit
displayTask t = select "#agrippa-task" >>= setText t
