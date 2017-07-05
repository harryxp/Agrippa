module Main where

import Prelude (Unit, bind, ($))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (charAt)
import DOM (DOM)

main :: forall e. Eff (dom :: DOM, console :: CONSOLE | e) Unit
main = ready $ do
  agrippaInput <- select "#agrippa-input"
  on "input" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM, console :: CONSOLE | e) Unit
handleAgrippaInput _ elem = do
  v <- getValue elem
  statusArea <- select "#status"
  for_ (runExcept (readString v)) \s ->
    let status = case charAt 0 s of
          Nothing -> "Awaiting user input."
          Just '=' -> "===="
          Just _ -> "No suitable plugin."
    in setText status statusArea
