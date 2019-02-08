module Agrippa.Plugins.OnlineSearch (onlineSearch) where

import Prelude (Unit, bind, map, pure, (<>), (=<<), (<<<))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), Replacement(..), replace, trim)
import Effect (Effect)
import Global.Unsafe (unsafeEncodeURIComponent)
import JQuery (JQuery)
import Web.HTML (window)
import Web.HTML.Window (open)

import Agrippa.Config (Config, getStringVal)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (createTextNode)

onlineSearch :: Plugin
onlineSearch = Plugin { name: "OnlineSearch"
                      , onInputChange: prompt
                      , onActivation: search
                      }

prompt :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
prompt _ config input _ = (map Just <<< createTextNode)
  case getStringVal "url" config of
    Left  err -> err
    Right url -> ("Keep typing the query.  Press <Enter> to visit " <> (completeUrl url input) <> ".")

search :: String -> Config -> String -> Effect (Maybe JQuery)
search _ config input = (map Just <<< createTextNode) =<<
  case getStringVal "url" config of
    Left  err -> pure err
    Right url -> openUrl (completeUrl url input)

openUrl :: String -> Effect String
openUrl url = do
  w <- window
  newWindowMb <- open url "_self" "" w
  pure case newWindowMb of
        Nothing -> "I can't get a window object.  Something went really wrong..."
        Just _  -> "Opening..."

completeUrl :: String -> String -> String
completeUrl url input = replace (Pattern "${q}") ((Replacement <<< unsafeEncodeURIComponent <<< trim) input) url

