module Agrippa.Utils (displayOutputText, mToE, openUrl) where

import Prelude (Unit, bind, pure, (>>=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (select, setText)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (WINDOW)
import DOM.HTML.Window (open)

displayOutputText :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutputText t = select "#agrippa-output" >>= setText t

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
