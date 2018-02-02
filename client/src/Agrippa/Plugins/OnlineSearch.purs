module Agrippa.Plugins.OnlineSearch (search, prompt) where

import Prelude (Unit, bind, pure, (<>), (>>=), (<<<))
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
import Agrippa.Utils (createSingletonTextNodeArray)

prompt :: forall e. String
                 -> Config
                 -> String
                 -> (Array JQuery -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) (Array JQuery)
prompt _ config input _ =
  case getStringVal "url" config of
    Left  err -> createSingletonTextNodeArray err
    Right url -> createSingletonTextNodeArray ("Keep typing the query.  Press <Enter> to visit " <> (completeUrl url input) <> ".")

search :: forall e. String
                 -> Config
                 -> String
                 -> (Array JQuery -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) (Array JQuery)
search _ config input _ =
  case getStringVal "url" config of
    Left  err -> createSingletonTextNodeArray err
    Right url -> (openUrl (completeUrl url input)) >>= createSingletonTextNodeArray

openUrl :: forall e. String -> Eff (dom :: DOM, window :: WINDOW | e) String
openUrl url = do
  w <- window
  maybeNewWindow <- open url "_self" "" w
  pure case maybeNewWindow of
        Nothing -> "Something went really wrong..."
        Just _  -> "Opening..."

completeUrl :: String -> String -> String
completeUrl url input = replace (Pattern "${q}") (Replacement ((encodeURIComponent <<< trim) input)) url

