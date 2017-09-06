module Agrippa.Plugins.OnlineSearch (search, prompt) where

import Prelude (Unit, pure, (<>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery)
import Data.Either (Either(..))
import Data.String (Pattern(..), Replacement(..), replace, trim)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)

import Agrippa.Config (Config, getStringVal)
import Agrippa.Utils (openUrl)

prompt :: forall e. Config
                 -> String
                 -> (Array JQuery -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
prompt config input _ = pure
  case getStringVal "url" config of
    Left  err -> err
    Right url -> "Keep typing the query.  Press <Enter> to visit " <> (completeUrl url input) <> "."

search :: forall e. Config
                 -> String
                 -> (Array JQuery -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
search config input _ =
  case getStringVal "url" config of
    Left  err -> pure err
    Right url -> openUrl (completeUrl url input)

completeUrl :: String -> String -> String
completeUrl url input = replace (Pattern "${q}") (Replacement (trim input)) url

