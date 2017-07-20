module Agrippa.Plugins.Bookmark (goto) where

import Prelude (Unit, bind, pure, (*>))
import Control.Monad.Eff (Eff)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

goto :: forall e. String
               -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
               -> Eff (dom :: DOM, window :: WINDOW | e) String
goto input _ = do
  w <- window
  case lookup input urlsByKey of
    Just url -> open url "_blank" "" w *> pure "Opening a new window..."
    Nothing  -> pure Nothing *> pure "Couldn't find a match for the keyword."

urlsByKey :: StrMap String
urlsByKey = fromFoldable
  [ Tuple "spark api" "https://spark.apache.org/docs/latest/api/java/" ]
