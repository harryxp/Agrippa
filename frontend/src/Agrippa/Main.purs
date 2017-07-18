module Agrippa.Main (main) where

import Prelude (Unit, bind, pure, (<$>), (>>=), (<>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getWhich, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.String (Pattern(..), indexOf, splitAt, trim)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax (AJAX, AffjaxResponse)

import Agrippa.Plugins.Registry (Plugin(..), PluginActivationMode(..), plugins)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM | e) Unit
main = ready do
  agrippaInput <- select "#agrippa-input"
  on "keyup" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent
                             -> JQuery
                             -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
handleAgrippaInput event inputElem = do
  keyCode <- getWhich event
  v <- getValue inputElem
  outputElem <- select "#status"
  for_ (runExcept (readString v)) (dispatchToPlugin outputElem keyCode)

dispatchToPlugin :: forall e. JQuery
                           -> Int
                           -> String
                           -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
dispatchToPlugin outputElem keyCode s =
  let maybePluginFeedback :: forall e1. Maybe (Eff (ajax :: AJAX, dom :: DOM | e1) String)
      maybePluginFeedback = do
        i                                                             <- indexOf (Pattern " ") s
        { before: keyword, after: input }                             <- splitAt i s
        (Plugin { name: n, computation: comp, activationMode: mode }) <- lookup keyword pluginsByKeyword
        if shouldFirePlugin mode keyCode
          then Just (comp (trim input) (displayResultOn outputElem))
          else Just (pure ("Plugin <" <> n <> "> selected.  Press <Enter> to activate."))
    in case maybePluginFeedback of
      Just pluginFeedback -> pluginFeedback >>= (\fb -> setText fb outputElem)
      Nothing             -> setText "No plugin selected." outputElem

shouldFirePlugin :: PluginActivationMode -> Int -> Boolean
shouldFirePlugin Enter 13       = true
shouldFirePlugin Enter  _       = false
shouldFirePlugin     _  _       = true

displayResultOn :: forall e. JQuery -> AffjaxResponse String -> Eff (dom :: DOM | e) Unit
displayResultOn outputElem { response: r } = setText r outputElem -- TODO check status code?

pluginsByKeyword :: StrMap Plugin
pluginsByKeyword = fromFoldable ((\p@(Plugin { keyword: k }) -> Tuple k p) <$> plugins)

-- TODO help text for plugins
