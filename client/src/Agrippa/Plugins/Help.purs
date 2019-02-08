module Agrippa.Plugins.Help (help) where

import Prelude (Unit, bind, discard, pure, (>>=), (*>))

import Affjax (get)
import Affjax.ResponseFormat (json)
import Affjax.StatusCode (StatusCode(..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (runAff_)
import JQuery (JQuery, append, create, setText)

import Agrippa.Config (Config)
import Agrippa.Help (fillHelpTable)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (displayOutputText)

help :: Plugin
help = Plugin { name: "Help"
              , onInputChange: showHelp
              , onActivation: \_ _ _ -> pure Nothing
              }

showHelp :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
showHelp _ _ _ _ = do
  helpTable <- create "<table>"
  tr        <- create "<tr>"
  createTh "Keyword" tr *> createTh "Task" tr *> append tr helpTable
  runAff_ (affHandler helpTable) (get json "/agrippa/config/")
  pure (Just helpTable)
  where affHandler helpTable (Right { status: (StatusCode 200)
                                    , body:   (Right config)
                                    }) = fillHelpTable config helpTable
        affHandler _         _         = displayOutputText "Failed to retrieve config from server."
        createTh :: String -> JQuery -> Effect Unit
        createTh contents tr = create "<th>" >>= \th -> setText contents th *> append th tr
