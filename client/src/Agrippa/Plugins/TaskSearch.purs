module Agrippa.Plugins.TaskSearch (taskSearch) where

import Prelude (Unit, bind, const, discard, pure, unit, (<>), (==))

import Affjax (get)
import Affjax.ResponseFormat (json)
import Affjax.StatusCode (StatusCode(..))
import Data.Array as A
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (toLower, trim)
import Data.String.Utils (includes)
import Effect (Effect)
import Effect.Aff (runAff_)
import JQuery (JQuery, append, create, getText, select, setValue, toArray)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (createTaskTableRows, createTaskTableRow, createTextNode, createTuple3Highlighted, createTuple3Plain, displayOutputText)

taskSearch :: Plugin
taskSearch = Plugin { name: "TaskSearch"
                    , prompt: showTaskTable
                    , promptAfterKeyTimeout: \_ _ _ _ -> pure unit
                    , activate: chooseFirstTask
                    }

showTaskTable :: String -> Config -> String -> Effect (Maybe JQuery)
showTaskTable _ _ input = do
  taskTable <- create "<table>"
  createTaskTableRow "<th>" "Keyword" "Task" createTuple3Plain createTuple3Plain taskTable
  runAff_ (affHandler taskTable) (get json "/agrippa/config/")

  helpText <- createTextNode "Press <Enter> to select first task."
  container <- create "<div>"
  append helpText container
  append taskTable container
  pure (Just container)
  where affHandler taskTable (Right { status: (StatusCode 200)
                                    , body:   (Right config)
                                    }) = createTaskTableRows
                                           config
                                           taskTable
                                           (const true)
                                           (\taskName -> includes (toLower (trim input)) (toLower taskName))
                                           createTuple3Plain
                                           (createTuple3Highlighted input)
        affHandler _         _         = displayOutputText "Failed to retrieve config from server."

chooseFirstTask :: String -> Config -> String -> Effect (Maybe JQuery)
chooseFirstTask taskName config _ = do
  firstTd <- select "#agrippa-output > div > table > tr > td:first"
  arr     <- toArray firstTd
  if A.length arr == 1
     then do
       firstTaskKeyword <- getText firstTd
       inputField       <- select "#agrippa-input"
       setValue (firstTaskKeyword <> " ") inputField
       -- manually trigger a keyup event
       triggerInputFieldKeyUp
       pure Nothing
     else
       pure Nothing

foreign import triggerInputFieldKeyUp :: Effect Unit
