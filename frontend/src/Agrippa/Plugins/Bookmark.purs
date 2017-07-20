module Agrippa.Plugins.Bookmark (goto, prompt) where

import Prelude (Unit, otherwise, pure, (>>=), (*>), (<>))
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
  | otherwise = joinWith " "
      ( "Matching websites (press <Enter> to goto the first one):"
      : matchingWebsites (trim input)
      )

goto :: forall e. String
               -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
               -> Eff (dom :: DOM, window :: WINDOW | e) String
goto input _ =
  let trimmedInput = trim input
      websites = matchingWebsites trimmedInput
  in case (head websites) of
    Just w  -> openWebsite w
    Nothing -> pure ("No match found for: " <> trimmedInput <> ".")

openWebsite :: forall e. String -> Eff (dom :: DOM, window :: WINDOW | e) String
openWebsite key =
  case lookup key urlsByKey of
    Just url -> (window >>= open url "_blank" "") *> pure "Opening a new window..."
    Nothing -> pure "Something went really wrong..."

matchingWebsites :: String -> Array String
matchingWebsites input = filter (contains (Pattern input)) (keys urlsByKey)

urlsByKey :: StrMap String
urlsByKey = fromFoldable
  [ Tuple "spark api" "https://spark.apache.org/docs/latest/api/java/"
  , Tuple "github" "https://github.com"
  ]

-- TODO newline in prompt
