module Agrippa.Main (main) where

import Prelude (Unit, bind, ($), (/=))

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), stripPrefix, takeWhile)

import Agrippa.Plugins.Calculator as Calc

main :: forall e. Eff (dom :: DOM | e) Unit
main = ready $ do
  agrippaInput <- select "#agrippa-input"
  on "input" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit
handleAgrippaInput _ elem = do
  v <- getValue elem
  statusArea <- select "#status"
  for_ (runExcept (readString v)) \s ->
    let prefix = takeWhile ((/=) ' ') s
        status =
          case stripPrefix (Pattern prefix) s of
            Just input -> dispatchToPlugin prefix input
            Nothing -> "Aww, something went wrong!"
    in setText status statusArea

dispatchToPlugin :: String -> String -> String
dispatchToPlugin "=" input = Calc.process input
dispatchToPlugin "" "" = "Awaiting user input."
dispatchToPlugin _ _ = "No suitable plugin."

