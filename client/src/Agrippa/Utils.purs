module Agrippa.Utils (createSingletonTextNodeArray, displayOutput, displayOutputText, mToE) where

import Prelude (Unit, bind, discard, flip, pure, (<$>), (>>=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, append, clear, create, select, setText)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Traversable (sequence_)
import DOM (DOM)

displayOutput :: forall e. Array JQuery -> Eff (dom :: DOM | e) Unit
displayOutput nodes = do
  output <- select "#agrippa-output"
  clear output
  sequence_ (flip append output <$> nodes)

displayOutputText :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutputText t = createSingletonTextNodeArray t >>= displayOutput

createSingletonTextNodeArray :: forall e. String -> Eff (dom :: DOM | e) (Array JQuery)
createSingletonTextNodeArray t = do
  div <- create "<div>"
  setText t div
  pure [div]

mToE :: forall a e. e -> Maybe a -> Either e a
mToE err Nothing = Left  err
mToE _ (Just x)  = Right x

