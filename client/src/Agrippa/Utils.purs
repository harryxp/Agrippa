module Agrippa.Utils (mToE, openUrl) where

import Prelude (bind, pure)
import Control.Monad.Eff (Eff)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

mToE :: forall a e. e -> Maybe a -> Either e a
mToE err Nothing = Left  err
mToE _ (Just x)  = Right x

openUrl :: forall e. String -> Eff (dom :: DOM, window :: WINDOW | e) String
openUrl url = do
  w <- window
  maybeNewWindow <- open url "_self" "" w
  pure case maybeNewWindow of
        Nothing -> "Something went really wrong..."
        Just _  -> "Opening..."
