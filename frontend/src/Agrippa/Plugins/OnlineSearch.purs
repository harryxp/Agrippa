module Agrippa.Plugins.OnlineSearch (search, prompt) where

import Prelude (Unit, bind, otherwise, pure, (==), (<<<), (<>))
import Control.Monad.Eff (Eff)
import Data.Array (head, (:))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, filterKeys, fromFoldable, keys, size, values)
import Data.String (Pattern(..), contains, joinWith, null, trim)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

prompt :: String -> String
prompt input
  | null (trim input) = buildPromptString urlsByKey
  | otherwise = (prompt' <<< matchWebsites <<< trim) input

prompt' :: StrMap String -> String
prompt' matched
  | size matched == 1 =
      case head (values matched) of
        Nothing  -> "Something went really wrong..."
        Just url ->  "Press <Enter> to search " <> url
  | otherwise = buildPromptString matched

search :: forall e. String
                 -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
search input _ =
  let trimmedInput = trim input
      matched = matchWebsites trimmedInput
  in search' matched

search' :: forall e. StrMap String -> Eff (dom :: DOM, window :: WINDOW | e) String
search' matched
  | size matched == 1 =
      case head (values matched) of
        Nothing  -> pure "Something went really wrong..."
        Just url -> openWebsite url
  | otherwise = pure (buildPromptString matched)

openWebsite :: forall e. String -> Eff (dom :: DOM, window :: WINDOW | e) String
openWebsite url = do
  w <- window
  maybeNewWindow <- open url "_blank" "" w
  pure case maybeNewWindow of
        Nothing -> "Something went really wrong..."
        Just _  -> "Opening a new window..."

matchWebsites :: String -> StrMap String
matchWebsites input = filterKeys (contains (Pattern input)) urlsByKey

urlsByKey :: StrMap String
urlsByKey = fromFoldable
  [ Tuple "spark api" "https://spark.apache.org/docs/latest/api/java/"
  , Tuple "github"    "https://github.com"
  , Tuple "pursuit"   "https://pursuit.purescript.org/search?q=${q}"
  , Tuple "wiki"      "https://wikipedia.org/wiki/Special:Search/${q}"
  ]

buildPromptString :: StrMap String -> String
buildPromptString map = joinWith "\n" ("Keep typing until one is left:" : (keys map))

-- TODO put urls in a config file
-- TODO query using template
