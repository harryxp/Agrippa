module Agrippa.Plugins.OnlineSearch (search, prompt) where

import Prelude (Unit, bind, otherwise, pure, (<>))
import Control.Monad.Eff (Eff)
import Data.Array (filter, head, (:))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, fromFoldable, keys, lookup)
import Data.String (Pattern(..), contains, joinWith, null, trim)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

prompt :: String -> String
prompt input
  | null (trim input) = ""
  | otherwise = joinWith "\n"
      ( "Matching websites (press <Enter> to goto the first one):"
      : matchWebsites (trim input)
      )

search :: forall e. String
                 -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
search input _ =
  let trimmedInput = trim input
      websites = matchWebsites trimmedInput
  in case (head websites) of
    Just w  -> openWebsite w
    Nothing -> pure ("No match found for: " <> trimmedInput <> ".")

openWebsite :: forall e. String -> Eff (dom :: DOM, window :: WINDOW | e) String
openWebsite key =
  case lookup key urlsByKey of
    Just url -> do
      w <- window
      maybeNewWindow <- open url "_blank" "" w
      pure case maybeNewWindow of
            Nothing -> "Something went really wrong..."
            Just _  -> "Opening a new window..."
    Nothing -> pure ("No match found for: " <> key <> ".")

matchWebsites :: String -> Array String
matchWebsites input = filter (contains (Pattern input)) (keys urlsByKey)

urlsByKey :: StrMap String
urlsByKey = fromFoldable
  [ Tuple "spark api" "https://spark.apache.org/docs/latest/api/java/"
  , Tuple "github"    "https://github.com"
  , Tuple "pursuit"   "https://pursuit.purescript.org/search?q=${q}"
  , Tuple "wiki"      "https://wikipedia.org/wiki/Special:Search/${q}"
  ]

-- TODO put urls in a config file
