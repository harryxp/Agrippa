module Agrippa.Plugins.OnlineSearch (search, prompt) where

import Prelude (Unit, bind, not, otherwise, pure, (==), (<<<), (<>))
import Control.Monad.Eff (Eff)
import Data.Array (filter, head, uncons, (:))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, filterKeys, fromFoldable, keys, size, values)
import Data.String (Pattern(..), Replacement(..), contains, joinWith, null, replace, trim)
import Data.String.Utils (words)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

prompt :: String -> String
prompt input
  | null (trim input) = buildPromptString urlsByKey
  | otherwise = case uncons (tokenize input) of
                  Just { head: h, tail: t } -> prompt' (matchWebsites h) t
                  Nothing -> "Something went really wrong..."

prompt' :: StrMap String -> Array String -> String
prompt' matched params
  | size matched == 1 =
      case head (values matched) of
        Nothing  -> "Something went really wrong..."
        Just url -> if contains (Pattern "${q}") url
                      then url <> " selected.  Input the search parameter after a space then press <Enter>."
                      else url <> " selected.  Press <Enter> to visit."
  | otherwise = buildPromptString matched

search :: forall e. String
                 -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
search input _
  | null (trim input) = pure (buildPromptString urlsByKey)
  | otherwise = case uncons (tokenize input) of
                  Just { head: h, tail: t } -> search' (matchWebsites h) t
                  Nothing -> pure "Something went really wrong..."

search' :: forall e. StrMap String
                  -> Array String
                  -> Eff (dom :: DOM, window :: WINDOW | e) String
search' matched params
  | size matched == 1 =
      case head (values matched) of
        Nothing  -> pure "Something went really wrong..."
        Just url -> if contains (Pattern "${q}") url
                      then case uncons params of
                            Just { head: h, tail: t } -> openWebsite (replace (Pattern "${q}") (Replacement h) url)
                            Nothing -> pure (url <> " selected.  Input the search parameter after a space then press <Enter>.")
                      else openWebsite url
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

tokenize :: String -> Array String
tokenize = filter (not <<< null) <<< words

-- TODO put urls in a config file
-- TODO query using a template library?
-- TODO only one query parameter is allowed now
