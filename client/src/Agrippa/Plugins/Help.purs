module Agrippa.Plugins.Help (help) where

import Prelude (Unit, bind, discard, pure, (>>=), (*>))

import Control.Monad.Aff (runAff_)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, append, create, setText)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config)
import Agrippa.Help (fillHelpTable)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (displayOutputText)

help :: Plugin
help = Plugin { name: "Help"
              , onInputChange: showHelp
              , onActivation: \_ _ _ _ -> pure Nothing
              }

showHelp :: forall e. String
                   -> Config
                   -> String
                   -> (JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                   -> Eff (ajax :: AJAX, dom :: DOM | e) (Maybe JQuery)
showHelp _ _ _ _ = do
  helpTable <- create "<table>"
  tr        <- create "<tr>"
  createTh "Keyword" tr *> createTh "Task" tr *> append tr helpTable
  runAff_ (affHandler helpTable) (get "/agrippa/config/")
  pure (Just helpTable)
  where affHandler _         (Left _)                     = displayOutputText "Failed to retrieve config from server."
        affHandler helpTable (Right { response: config }) = fillHelpTable config helpTable
        createTh :: forall e1. String -> JQuery -> Eff (dom :: DOM | e1) Unit
        createTh contents tr = create "<th>" >>= \th -> setText contents th *> append th tr
