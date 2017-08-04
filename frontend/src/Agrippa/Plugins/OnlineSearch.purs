module Agrippa.Plugins.OnlineSearch (search, prompt) where

import Prelude (Unit, bind, pure, (<>))
import Control.Monad.Eff (Eff)
import Data.Argonaut.Core (toObject, toString)
import Data.Either (Either(..))
import Data.StrMap (lookup)
import Data.String (Pattern(..), Replacement(..), replace, trim)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)

import Agrippa.Config (Config)
import Agrippa.Plugins.Utils (openWebsite)
import Agrippa.Utils (mToE)

prompt :: Config -> String -> String
prompt config input =
  case getUrl config of
    Left err -> err
    Right url -> "Keep typing the query.  Press <Enter> to visit " <> (completeUrl url input) <> "."

search :: forall e. Config
                 -> String
                 -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
search config input _ =
  case getUrl config of
    Left err -> pure err
    Right url -> openWebsite (completeUrl url input)

getUrl :: Config -> Either String String
getUrl config = do
  pluginInfoMap <- mToE "[OnlineSearch] Config Error: config must be a JSON object."           (toObject config)
  urlJson       <- mToE "[OnlineSearch] Config Error: config must contain a 'url' attribute."  (lookup "url" pluginInfoMap)
  url           <- mToE "[OnlineSearch] Config Error: value of 'url' attribute must a string." (toString urlJson)
  pure url

completeUrl :: String -> String -> String
completeUrl url input = replace (Pattern "${q}") (Replacement (trim input)) url

