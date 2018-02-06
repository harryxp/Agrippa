module Agrippa.Utils (createTextNode, displayOutput, displayOutputText, mToE) where

import Prelude (Unit, bind, discard, pure, (>>=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, append, clear, create, select, setText)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import DOM (DOM)

displayOutput :: forall e. JQuery -> Eff (dom :: DOM | e) Unit
displayOutput node = do
  output <- select "#agrippa-output"
  clear output
  append node output

displayOutputText :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutputText t = createTextNode t >>= displayOutput

createTextNode :: forall e. String -> Eff (dom :: DOM | e) JQuery
createTextNode t = do
  div <- create "<div>"
  setText t div
  pure div

mToE :: forall a e. e -> Maybe a -> Either e a
mToE err Nothing = Left  err
mToE _ (Just x)  = Right x

