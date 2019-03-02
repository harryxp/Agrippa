module Agrippa.Plugins.TaskList (taskList) where

import Prelude (bind, const, discard, pure, unit)

import Affjax (get)
import Affjax.ResponseFormat (json)
import Affjax.StatusCode (StatusCode(..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (runAff_)
import JQuery (JQuery, create)

import Agrippa.Config (Config)
import Agrippa.Help (createTaskTableData, createTaskTableRow)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (displayOutputText)

taskList :: Plugin
taskList = Plugin { name: "TaskList"
                  , prompt: showTaskTable
                  , promptAfterKeyTimeout: \_ _ _ _ -> pure unit
                  , activate: \_ _ _ -> pure Nothing
                  }

showTaskTable :: String -> Config -> String -> Effect (Maybe JQuery)
showTaskTable _ _ _ = do
  taskTable <- create "<table>"
  createTaskTableRow "<th>" "Keyword (followed by <SPACE>)" "Task" taskTable
  runAff_ (affHandler taskTable) (get json "/agrippa/config/")
  pure (Just taskTable)
  where affHandler taskTable (Right { status: (StatusCode 200)
                                    , body:   (Right config)
                                    }) = createTaskTableData config taskTable (const true)
        affHandler _         _         = displayOutputText "Failed to retrieve config from server."
