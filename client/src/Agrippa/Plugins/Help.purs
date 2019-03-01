module Agrippa.Plugins.Help (help) where

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

help :: Plugin
help = Plugin { name: "Help"
              , prompt: showHelp
              , promptAfterKeyTimeout: \_ _ _ _ -> pure unit
              , activate: \_ _ _ -> pure Nothing
              }

showHelp :: String -> Config -> String -> Effect (Maybe JQuery)
showHelp _ _ _ = do
  helpTable <- create "<table>"
  createTaskTableRow "<th>" "Keyword (followed by <SPACE>)" "Task" helpTable
  runAff_ (affHandler helpTable) (get json "/agrippa/config/")
  pure (Just helpTable)
  where affHandler helpTable (Right { status: (StatusCode 200)
                                    , body:   (Right config)
                                    }) = createTaskTableData config helpTable (const true)
        affHandler _         _         = displayOutputText "Failed to retrieve config from server."
