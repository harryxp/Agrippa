module Agrippa.Main (main) where

import Prelude (Unit, bind, discard, pure, show, unit, void, ($), (<$>), (*>), (>>=), (<>))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, append, create, getWhich, getValue, on, ready, select, setText, toggle)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import DOM.HTML.Types (WINDOW)
import Data.Argonaut.Core (toObject, toString)
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.StrMap (StrMap, foldM, lookup)
import Data.String (Pattern(..), indexOf, splitAt)
import Data.Tuple.Nested (Tuple3, tuple3, uncurry3)
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config)
import Agrippa.Plugins.Registry (Plugin(..), pluginsByName)
import Agrippa.Plugins.Utils (openWebsite)
import Agrippa.Utils (mToE)

main :: forall e. Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
main = ready $
  loadConfig (\config -> buildHelp config *> installInputHandler config)

loadConfig :: forall e. (Config -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                     -> Eff (ajax :: AJAX, dom :: DOM | e) Unit
loadConfig onSuccess = void $
  runAff
    (\_ -> displayStatus "Failed to retrieve config from server.")
    (\{ response: r } -> onSuccess r)
    (get "/agrippa/config/")

installInputHandler :: forall e. Config
                              -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
installInputHandler config = select "#agrippa-input" >>= on "keyup" (handleInput config)

-- input and output

handleInput :: forall e. Config
                      -> JQueryEvent
                      -> JQuery
                      -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
handleInput config event inputField = do
  keyCode <- getWhich event
  wholeInput <- getValue inputField
  for_ (runExcept (readString wholeInput)) (dispatchToPlugin config keyCode)

dispatchToPlugin :: forall e. Config
                           -> Int
                           -> String
                           -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
dispatchToPlugin config keyCode wholeInput =
  case findPlugin config keyCode wholeInput of
    Left err -> case keyCode of
                  13 -> openWebsite ("https://www.google.com/search?q=" <> wholeInput) >>= displayOutput
                  otherwise -> displayStatus (err <> "  Press <Enter> to search on Google.") *> clearOutput
    Right t3 -> (uncurry3 invokePlugin t3) keyCode

findPlugin :: Config -> Int -> String -> Either String (Tuple3 Plugin Config String)
findPlugin config keyCode wholeInput = do
  i                                       <- mToE "No keyword found in input."                                                  (indexOf (Pattern " ") wholeInput)
  { before: keyword, after: pluginInput } <- mToE "Failed to parse input.  This is impossible!"                                 (splitAt i wholeInput)
  configMap                               <- mToE "Config Error: must be a JSON object."                                        (toObject config)
  pluginInfoByKeywordJson                 <- mToE "Config Error: must have key mappings."                                       (lookup "key-mappings" configMap)
  pluginInfoByKeywordMap                  <- mToE "Config Error: key mappings must be a JSON object."                           (toObject pluginInfoByKeywordJson)
  pluginInfoJson                          <- mToE ("Keyword '" <> keyword <> "' not found in config.")                          (lookup keyword pluginInfoByKeywordMap)
  pluginInfoMap                           <- mToE "Config Error: each key must map to a JSON object."                           (toObject pluginInfoJson)
  pluginNameJson                          <- mToE "Config Error: each key must map to a JSON object with a 'plugin' attribute." (lookup "plugin" pluginInfoMap)
  pluginName                              <- mToE "Config Error: value of 'plugin' attribute must be a string."                 (toString pluginNameJson)
  plugin                                  <- mToE ("Can't find plugin with name '" <> pluginName <> "'.")                       (lookup pluginName pluginsByName)
  pure (tuple3 plugin pluginInfoJson pluginInput)

invokePlugin :: forall e. Plugin
                       -> Config
                       -> String
                       -> Int
                       -> Eff (ajax :: AJAX, dom :: DOM, window :: WINDOW | e) Unit
invokePlugin (Plugin { name: n , onIncrementalChange: inc , onActivation: act }) config pluginInput keyCode = do
  displayStatus n
  case keyCode of
    13 -> act config pluginInput displayOutput >>= displayOutput -- activation
    otherwise -> displayOutput (inc config pluginInput)          -- incremental

displayStatus :: forall e. String -> Eff (dom :: DOM | e) Unit
displayStatus r = select "#agrippa-status" >>= setText r

displayOutput :: forall e. String -> Eff (dom :: DOM | e) Unit
displayOutput r = select "#agrippa-output" >>= setText r

clearOutput :: forall e. Eff (dom :: DOM | e) Unit
clearOutput = select "#agrippa-output" >>= setText ""

-- help

buildHelp :: forall e. Config -> Eff (dom :: DOM | e) Unit
buildHelp config = do
  helpLink <- select "#agrippa-help-link"
  helpContent <- select "#agrippa-help-content"
  buildHelpTextForPlugins config helpContent
  on "click" (handleHelpLink helpContent) helpLink

buildHelpTextForPlugins :: forall e. Config -> JQuery -> Eff (dom :: DOM | e) Unit
buildHelpTextForPlugins config helpContent =
  let pluginHelpByKeyword :: Either String (StrMap String)
      pluginHelpByKeyword = do
        configMap               <- mToE "Config Error: must be a JSON object."              (toObject config)
        pluginInfoByKeywordJson <- mToE "Config Error: must have key mappings."             (lookup "key-mappings" configMap)
        pluginInfoByKeywordMap  <- mToE "Config Error: key mappings must be a JSON object." (toObject pluginInfoByKeywordJson)
        pure (show <$> pluginInfoByKeywordMap)
  in case pluginHelpByKeyword of
      Left err -> displayStatus err
      Right m -> foldM buildHelpTextForPlugin unit m

buildHelpTextForPlugin :: forall e. Unit -> String -> String -> Eff (dom :: DOM | e) Unit
buildHelpTextForPlugin _ keyword pluginDesc = do
  helpTable <- select "#agrippa-help-table"
  tr <- create "<tr>"
  createTd pluginDesc tr *> createTd keyword tr *> append tr helpTable
  where
    createTd :: String -> JQuery -> Eff (dom :: DOM | e) Unit
    createTd txt tr = create "<td>" >>= \td -> setText txt td *> append td tr

handleHelpLink :: forall e. JQuery -> JQueryEvent -> JQuery -> Eff (dom :: DOM | e) Unit
handleHelpLink helpContent _ _ = toggle helpContent

-- TODO check status code?
-- TODO put google url into config
-- TODO Do not look up config repeatedly
-- TODO Refactor many "plugin"s to "function"s
-- TODO formatted string instead of <>
