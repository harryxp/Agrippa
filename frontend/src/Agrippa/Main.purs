module Agrippa.Main (main) where

import Prelude (Unit, bind, (<$>), (/=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), stripPrefix, takeWhile)
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.Tuple (Tuple(..))

import Agrippa.Plugins.Registry (Plugin(..), plugins)

main :: forall e. Eff (dom :: DOM | e) Unit
main = ready do
  agrippaInput <- select "#agrippa-input"
  on "input" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit
handleAgrippaInput _ elem = do
  v <- getValue elem
  statusArea <- select "#status"
  for_ (runExcept (readString v)) \s ->
    let keyword = takeWhile ((/=) ' ') s
        maybeInput = stripPrefix (Pattern keyword) s
        status = case maybeInput of
                    Just input -> dispatchToPlugin keyword input
                    Nothing    -> "Aww, something went wrong!"
    in setText status statusArea

dispatchToPlugin :: String -> String -> String
dispatchToPlugin keyword input =
  case lookup keyword pluginsByKeyword of
    Just (Plugin { computation: c }) -> c input
    Nothing                          -> "Awaiting user input."

pluginsByKeyword :: StrMap Plugin
pluginsByKeyword = fromFoldable ((\p@(Plugin { keyword: k }) -> Tuple k p) <$> plugins)

-- TODO focus on input when ready
-- TODO help text for plugins
