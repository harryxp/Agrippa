module Agrippa.Main (main) where

import Prelude (Unit, bind, discard, unit, (<$>), (*>), (>>=), (<>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, getWhich, getValue, on, ready, select, setText, toggle)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Data.Array (foldM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.String (Pattern(..), indexOf, splitAt)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax (AJAX)

import Agrippa.Plugins.Registry (Plugin(..), plugins)
import Agrippa.Plugins.Utils (openWebsite)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
main = ready do
  input <- select "#agrippa-input"
  on "keyup" handleInput input

  helpLink <- select "#agrippa-help-link"
  helpContent <- select "#agrippa-help-content"
  buildHelpTextForPlugins helpContent
  on "click" (handleHelpLink helpContent) helpLink

-- input

handleInput :: forall e. JQueryEvent
                      -> JQuery
                      -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
handleInput event inputField = do
  keyCode <- getWhich event
  wholeInput <- getValue inputField
  for_ (runExcept (readString wholeInput)) (dispatchToPlugin keyCode)

dispatchToPlugin :: forall e. Int
                           -> String
                           -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
dispatchToPlugin keyCode wholeInput =
  let maybePlugin :: Maybe (Tuple Plugin String)
      maybePlugin = do
        i                                       <- indexOf (Pattern " ") wholeInput
        { before: keyword, after: pluginInput } <- splitAt i wholeInput
        plugin                                  <- lookup keyword pluginsByKeyword
        Just (Tuple plugin pluginInput)
  in do
    indicator <- select "#agrippa-plugin-indicator"
    case maybePlugin of
      Just (Tuple (Plugin { name: n, onIncrementalChange: inc, onActivation: act }) pluginInput) -> do
        setText n indicator
        case keyCode of
          13 -> act pluginInput displayOutput >>= displayOutput -- activation
          otherwise -> displayOutput (inc pluginInput)          -- incremental
      Nothing ->
        case keyCode of
          13 -> openWebsite ("https://www.google.com/search?q=" <> wholeInput) >>= displayOutput
          otherwise -> setText "No plugin selected.  Press <Enter> to search on Google." indicator *> clearOutput

displayOutput :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutput r = select "#agrippa-output" >>= setText r

clearOutput :: forall e. Eff (dom :: DOM | e) Unit
clearOutput = select "#agrippa-output" >>= setText ""

pluginsByKeyword :: StrMap Plugin
pluginsByKeyword = fromFoldable ((\p@(Plugin { keyword: k }) -> Tuple k p) <$> plugins)

-- help

buildHelpTextForPlugins :: forall e. JQuery -> Eff (dom :: DOM | e) Unit
buildHelpTextForPlugins helpContent = foldM buildHelpTextForPlugin unit plugins

buildHelpTextForPlugin :: forall e. Unit -> Plugin -> Eff (dom :: DOM | e) Unit
buildHelpTextForPlugin _ (Plugin { name: n, keyword: key }) = do
  helpTable <- select "#agrippa-help-table"
  tr <- create "<tr>"
  createTd n tr *> createTd key tr *> append tr helpTable
  where
    createTd :: String -> JQuery -> Eff (dom :: DOM | e) Unit
    createTd txt tr = create "<td>" >>= \td -> setText txt td *> append td tr

handleHelpLink :: forall e. JQuery -> JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit
handleHelpLink helpContent _ _ = toggle helpContent

