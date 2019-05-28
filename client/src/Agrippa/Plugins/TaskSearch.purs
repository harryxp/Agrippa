module Agrippa.Plugins.TaskSearch (taskSearch) where

import Prelude (Unit, bind, const, discard, pure, unit, (<>), (==))

import Affjax (get)
import Affjax.ResponseFormat (json)
import Affjax.StatusCode (StatusCode(..))
import Data.Array (length)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (toLower, trim)
import Data.String.Utils (includes)
import Effect (Effect)
import Effect.Aff (runAff_)
import JQuery (JQuery, create, getHtml, select, setValue, toArray)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (createTaskTableRows, createTaskTableRow, displayOutputText)

taskSearch :: Plugin
taskSearch = Plugin { name: "TaskSearch"
                    , prompt: showTaskTable
                    , promptAfterKeyTimeout: \_ _ _ _ -> pure unit
                    , activate: chooseFirstTask
                    }

showTaskTable :: String -> Config -> String -> Effect (Maybe JQuery)
showTaskTable _ _ input = do
  taskTable <- create "<table>"
  createTaskTableRow "<th>" "Keyword" "Task" taskTable
  runAff_ (affHandler taskTable) (get json "/agrippa/config/")
  pure (Just taskTable)
  where affHandler taskTable (Right { status: (StatusCode 200)
                                    , body:   (Right config)
                                    }) = createTaskTableRows
                                           config
                                           taskTable
                                           (const true)
                                           (\taskName -> includes (toLower (trim input)) (toLower taskName))
        affHandler _         _         = displayOutputText "Failed to retrieve config from server."

chooseFirstTask :: String -> Config -> String -> Effect (Maybe JQuery)
chooseFirstTask taskName config _ = do
  firstTd <- select "#agrippa-output > table > tr > td:first"
  arr     <- toArray firstTd
  if length arr == 1
     then do
       firstTaskKeyword <- getHtml firstTd
       inputField       <- select "#agrippa-input"
       setValue (firstTaskKeyword <> " ") inputField
       -- manually trigger a keyup event
       triggerInputFieldKeyUp
       pure Nothing
     else
       pure Nothing

foreign import triggerInputFieldKeyUp :: Effect Unit
