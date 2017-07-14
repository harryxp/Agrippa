module Agrippa.Main (main) where

import Prelude --(Unit, bind, pure, (/=), (<$>), (>>=))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (EXCEPTION)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), stripPrefix, takeWhile)
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax
import Unsafe.Coerce (unsafeCoerce)

import Agrippa.Plugins.Registry (Plugin(..), plugins)

main = ready do
  agrippaInput <- select "#agrippa-input"
  on "input" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent
                             -> JQuery
                             -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
handleAgrippaInput _ inputElem = do
  v <- getValue inputElem
  statusArea <- select "#status"
  for_ (runExcept (readString v)) \s ->
    let keyword = takeWhile ((/=) ' ') s  -- TODO
        maybeInput = stripPrefix (Pattern keyword) s
        pluginFeedback :: forall e. Eff (ajax :: AJAX, dom :: DOM | e) String
        pluginFeedback =
          case maybeInput of
            Just input -> dispatchToPlugin keyword input (displayResultOn statusArea)
            Nothing    -> pure "Aww, something went wrong!"
    in pluginFeedback >>= (\o -> setText o statusArea)

dispatchToPlugin :: forall e. String
                           -> String
                           -> (AffjaxResponse String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                           -> Eff (ajax :: AJAX, dom :: DOM | e) String
dispatchToPlugin keyword input displayResult =
  case lookup keyword pluginsByKeyword of
    Just (Plugin { computation: c }) -> c input displayResult
    Nothing                          -> pure "Awaiting user input."

displayResultOn :: forall e. JQuery -> AffjaxResponse String -> Eff (dom :: DOM | e) Unit
displayResultOn outputElem { response: r } = setText r outputElem -- TODO check status code?

pluginsByKeyword :: StrMap Plugin
pluginsByKeyword = fromFoldable ((\p@(Plugin { keyword: k }) -> Tuple k p) <$> plugins)

-- TODO focus on input when ready
-- TODO help text for plugins
-- TODO add <ENTER> action to plugins
