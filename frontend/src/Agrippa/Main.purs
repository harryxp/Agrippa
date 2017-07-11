module Agrippa.Main (main) where

import Prelude (Unit, bind, map, ($), (/=))

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), stripPrefix, takeWhile)
import Data.StrMap as M
import Data.Tuple as T

import Agrippa.Plugins.Registry

import Unsafe.Coerce  --TODO

main :: forall e. Eff (dom :: DOM | e) Unit
main = ready $ do
  agrippaInput <- select "#agrippa-input"
  on "input" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit
handleAgrippaInput _ elem = do
  v <- getValue elem
  statusArea <- select "#status"
  for_ (runExcept (readString v)) \s ->
    let keyword = takeWhile ((/=) ' ') s
        status =
          case stripPrefix (Pattern keyword) s of
            Just input -> dispatchToPlugin keyword input
            Nothing -> "Aww, something went wrong!"
    in setText status statusArea

pluginsByKeyword :: M.StrMap Plugin
--pluginsByKeyword = unsafeCoerce 1
pluginsByKeyword =
  let tuples :: Array (T.Tuple String Plugin)
      tuples = map (\p -> T.Tuple p.keyword p) plugins
  in
    M.fromFoldable tuples

dispatchToPlugin :: String -> String -> String
dispatchToPlugin keyword input =
  case M.lookup keyword pluginsByKeyword of
    Just p -> p.computation input
    Nothing -> "Awaiting user input."

