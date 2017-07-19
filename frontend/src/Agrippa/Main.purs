module Agrippa.Main (main) where

import Prelude (Unit, bind, discard, show, unit, (<$>), (*>), (>>=), (<>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, getWhich, getValue, on, ready, select, setText, toggle)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Array (foldM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.String (Pattern(..), indexOf, splitAt, trim)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax (AJAX)

import Agrippa.Plugins.Registry (Plugin(..), PluginActivationMode(..), plugins)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM | e) Unit
main = ready do
  input <- select "#agrippa-input"
  on "keyup" handleInput input
  helpLink <- select "#agrippa-help-link"
  helpDiv <- select "#agrippa-help-content"
  buildHelpTextForPlugins helpDiv
  on "click" (handleHelpLink helpDiv) helpLink

-- input

handleInput :: forall e. JQueryEvent
                      -> JQuery
                      -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
handleInput event inputElem = do
  keyCode <- getWhich event
  v <- getValue inputElem
  for_ (runExcept (readString v)) (dispatchToPlugin keyCode)

dispatchToPlugin :: forall e. Int
                           -> String
                           -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
dispatchToPlugin keyCode s =
  let maybePlugin :: Maybe (Tuple Plugin String)
      maybePlugin = do
        i                                 <- indexOf (Pattern " ") s
        { before: keyword, after: input } <- splitAt i s
        plugin                            <- lookup keyword pluginsByKeyword
        Just (Tuple plugin input)
  in do
    indicatorElem <- select "#agrippa-plugin-indicator"
    case maybePlugin of
      Just (Tuple (Plugin { name: n, computation: comp, activationMode: mode }) input) -> do
        setText n indicatorElem
        if shouldFirePlugin mode keyCode
          -- if a plugin is found and should be fired
          --   show immediate feedback from plugin
          --   also give it the ability to update the output div later since it may run asynchronous computation
          then comp (trim input) displayOnOutputDiv >>= displayOnOutputDiv
          else displayOnOutputDiv ("Plugin <" <> n <> "> selected.  Press <Enter> to activate.")
      Nothing -> setText "No plugin selected." indicatorElem *> clearOutputDiv

shouldFirePlugin :: PluginActivationMode -> Int -> Boolean
shouldFirePlugin Enter 13 = true
shouldFirePlugin Enter  _ = false
shouldFirePlugin     _  _ = true

displayOnOutputDiv :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOnOutputDiv r = select "#agrippa-output" >>= setText r

clearOutputDiv :: forall e. Eff (dom :: DOM | e) Unit
clearOutputDiv = select "#agrippa-output" >>= setText ""

pluginsByKeyword :: StrMap Plugin
pluginsByKeyword = fromFoldable ((\p@(Plugin { keyword: k }) -> Tuple k p) <$> plugins)

-- help

buildHelpTextForPlugins :: forall e. JQuery -> Eff (dom :: DOM | e) Unit
buildHelpTextForPlugins helpDiv = foldM buildHelpTextForPlugin unit plugins

buildHelpTextForPlugin :: forall e. Unit -> Plugin -> Eff (dom :: DOM | e) Unit
buildHelpTextForPlugin _ (Plugin { name: n, keyword: key, activationMode: mode }) = do
  helpTable <- select "#agrippa-help-table"
  tr <- create "<tr>"
  createTd n tr *> createTd key tr *> createTd (show mode) tr *> append tr helpTable
  where
    createTd :: String -> JQuery -> Eff (dom :: DOM | e) Unit
    createTd txt tr = create "<td>" >>= \td -> setText txt td *> append td tr

handleHelpLink :: forall e. JQuery
                         -> JQueryEvent
                         -> JQuery
                         -> Eff (dom :: DOM | e) Unit
handleHelpLink helpDiv _ _ = toggle helpDiv
