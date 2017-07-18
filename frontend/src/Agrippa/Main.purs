module Agrippa.Main (main) where

import Prelude (Unit, bind, pure, (<$>), (>>=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), indexOf, splitAt)
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax (AJAX, AffjaxResponse)

import Agrippa.Plugins.Registry (Plugin(..), plugins)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM | e) Unit
main = ready do
  agrippaInput <- select "#agrippa-input"
  on "input" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent
                             -> JQuery
                             -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
handleAgrippaInput _ inputElem = do
  v <- getValue inputElem
  statusArea <- select "#status"
  for_ (runExcept (readString v)) (dispatchToPlugin statusArea)

dispatchToPlugin :: forall e. JQuery
                           -> String
                           -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
dispatchToPlugin outputElem s =
  let maybePluginFeedback :: forall e1. Maybe (Eff (ajax :: AJAX, dom :: DOM | e1) String)
      maybePluginFeedback = do
        i                                 <- indexOf (Pattern " ") s
        { before: keyword, after: input } <- splitAt i s
        Plugin { computation: comp }      <- lookup keyword pluginsByKeyword
        pure (comp input (displayResultOn outputElem))
  in case maybePluginFeedback of
      Just pluginFeedback -> pluginFeedback >>= (\fb -> setText fb outputElem)
      Nothing             -> setText "No plugin selected." outputElem

displayResultOn :: forall e. JQuery -> AffjaxResponse String -> Eff (dom :: DOM | e) Unit
displayResultOn outputElem { response: r } = setText r outputElem -- TODO check status code?

pluginsByKeyword :: StrMap Plugin
pluginsByKeyword = fromFoldable ((\p@(Plugin { keyword: k }) -> Tuple k p) <$> plugins)

-- TODO focus on input when ready
-- TODO help text for plugins
-- TODO add <ENTER> action to plugins
