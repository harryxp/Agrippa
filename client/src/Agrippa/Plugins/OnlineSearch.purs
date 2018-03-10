module Agrippa.Plugins.OnlineSearch (onlineSearch) where

import Prelude (Unit, bind, map, pure, (<>), (=<<), (<<<))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), Replacement(..), replace, trim)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)
import Global (encodeURIComponent)

import Agrippa.Config (Config, getStringVal)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (createTextNode)

onlineSearch :: Plugin
onlineSearch = Plugin { name: "OnlineSearch"
                      , onInputChange: prompt
                      , onActivation: search
                      }

prompt :: forall e. String
                 -> Config
                 -> String
                 -> (JQuery -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) (Maybe JQuery)
prompt _ config input _ = (map Just <<< createTextNode)
  case getStringVal "url" config of
    Left  err -> err
    Right url -> ("Keep typing the query.  Press <Enter> to visit " <> (completeUrl url input) <> ".")

search :: forall e. String
                 -> Config
                 -> String
                 -> (JQuery -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) (Maybe JQuery)
search _ config input _ = (map Just <<< createTextNode) =<<
  case getStringVal "url" config of
    Left  err -> pure err
    Right url -> openUrl (completeUrl url input)

openUrl :: forall e. String -> Eff (dom :: DOM, window :: WINDOW | e) String
openUrl url = do
  w <- window
  maybeNewWindow <- open url "_self" "" w
  pure case maybeNewWindow of
        Nothing -> "I can't get a window object.  Something went really wrong..."
        Just _  -> "Opening..."

completeUrl :: String -> String -> String
completeUrl url input = replace (Pattern "${q}") ((Replacement <<< encodeURIComponent <<< trim) input) url

