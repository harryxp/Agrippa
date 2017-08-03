module Agrippa.Utils (mToE) where

import Data.Maybe (Maybe(..))
import Data.Either (Either(..))

mToE :: forall a e. e -> Maybe a -> Either e a
mToE err Nothing = Left err
mToE _ (Just x) = Right x
