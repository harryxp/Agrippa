module Agrippa.Main (main) where

import Prelude (Unit, bind, discard, unit, void, ($), (<$>), (*>), (>>=), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, getWhich, getValue, on, ready, select, setText, toggle)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Data.Argonaut.Core (JObject, Json, toObject)
import Data.Array (foldM)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, fromFoldable, lookup)
import Data.String (Pattern(..), indexOf, splitAt)
import Data.Tuple (Tuple(..))
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Plugins.Registry (Plugin(..), plugins)
import Agrippa.Plugins.Utils (openWebsite)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
main = ready do
  loadConfig installInputHandler
  buildHelp

loadConfig :: forall e. (Json -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                     -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
loadConfig onConfigSucc = void $
  runAff
    (\_ -> displayOutput "Failed to retrieve config from server.  Can't proceed.")
    (\{ response: r } -> onConfigSucc r)
    (get "/agrippa/config/")

installInputHandler :: forall e. Json
                              -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
installInputHandler config =
  case toObject config of
    Nothing -> displayOutput "Config must be a JSON object.  Can't proceed."
    Just conf -> select "#agrippa-input" >>= on "keyup" (handleInput conf)

-- input and output

handleInput :: forall e. JObject
                      -> JQueryEvent
                      -> JQuery
                      -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
handleInput config event inputField = do
  keyCode <- getWhich event
  wholeInput <- getValue inputField
  for_ (runExcept (readString wholeInput)) (dispatchToPlugin config keyCode)

dispatchToPlugin :: forall e. JObject
                           -> Int
                           -> String
                           -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
dispatchToPlugin config keyCode wholeInput =
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

buildHelp :: forall e. Eff (dom :: DOM | e) Unit
buildHelp = do
  helpLink <- select "#agrippa-help-link"
  helpContent <- select "#agrippa-help-content"
  buildHelpTextForPlugins helpContent
  on "click" (handleHelpLink helpContent) helpLink

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

-- TODO check status code?
