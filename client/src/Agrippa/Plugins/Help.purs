module Agrippa.Plugins.Help (help) where

import Prelude (Unit, pure, (<$>))

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Data.Maybe (Maybe(..))
import DOM (DOM)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (createTextNode)

help :: Plugin
help = Plugin { name: "Help"
              , onInputChange: showHelp
              , onActivation: \_ _ _ _ -> pure Nothing
              }

showHelp :: forall e. String
                   -> Config
                   -> String
                   -> (JQuery -> Eff (dom :: DOM | e) Unit)
                   -> Eff (dom :: DOM | e) (Maybe JQuery)
showHelp _ _ _ _ = Just <$> (createTextNode "help")
