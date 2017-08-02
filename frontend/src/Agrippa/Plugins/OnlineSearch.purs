module Agrippa.Plugins.OnlineSearch (search, prompt) where

import Prelude (Unit, not, pure, (==), (<<<), (<>))
import Control.Applicative (class Applicative)
import Control.Monad.Eff (Eff)
import Data.Array (filter, head, uncons, (:))
import Data.Identity (Identity(..))
import Data.Maybe (Maybe(..))
import Data.StrMap (StrMap, filterKeys, fromFoldable, keys, size, values)
import Data.String (Pattern(..), Replacement(..), contains, joinWith, null, replace)
import Data.String.Utils (words)
import Data.Tuple (Tuple(..))
import DOM (DOM)
import DOM.HTML.Types (WINDOW)

import Agrippa.Plugins.Utils (openWebsite)

prompt :: String -> String
prompt input =
  let identityStr :: Identity String
      identityStr =
        dispatch
          input
          (\url ->   pure (url <> " selected.  Press <Enter> to visit."))
          (\url _ -> pure (url <> " selected.  Input the search parameter after a space then press <Enter>."))
  in case identityStr of Identity s -> s

search :: forall e. String
                 -> (String -> Eff (dom :: DOM, window :: WINDOW | e) Unit)
                 -> Eff (dom :: DOM, window :: WINDOW | e) String
search input _ =
  dispatch
    input
    openWebsite
    (\url param -> openWebsite (replace (Pattern "${q}") (Replacement param) url))

dispatch :: forall a. Applicative a => String
                                    -> (String -> a String)
                                    -> (String -> String -> a String)
                                    -> a String
dispatch input onSimpleUrl onUrlWithParam =
  case uncons (tokenize input) of
    -- no input
    Nothing -> pure (buildFeedbackString onlineSearchEntries)
    -- website key and params
    Just { head: key, tail: params } ->
      let matched = matchWebsites key in
        if size matched == 1
        then case head (values matched) of      -- single matching website found
              -- impossible case
              Nothing  -> pure "Something went really wrong..."
              -- url selected
              Just url -> if contains (Pattern "${q}") url
                          then case uncons params of -- url needs params
                                -- at least one param provided
                                Just { head: h, tail: t } -> onUrlWithParam url h
                                -- no param provided
                                Nothing -> pure (url <> " selected.  Input the search parameter after a space then press <Enter>.")
                          else onSimpleUrl url       -- url does not need params
        else pure (buildFeedbackString matched) -- zero or many matching websites found

matchWebsites :: String -> StrMap String
matchWebsites input = filterKeys (contains (Pattern input)) onlineSearchEntries

onlineSearchEntries :: StrMap String
onlineSearchEntries = fromFoldable
  [ Tuple "spark api" "https://spark.apache.org/docs/latest/api/java/"
  , Tuple "github"    "https://github.com"
  , Tuple "pursuit"   "https://pursuit.purescript.org/search?q=${q}"
  , Tuple "wiki"      "https://wikipedia.org/wiki/Special:Search/${q}"
  ]

buildFeedbackString :: StrMap String -> String
buildFeedbackString map = joinWith "\n" ("Keep typing until one is left:" : (keys map))

tokenize :: String -> Array String
tokenize = filter (not <<< null) <<< words

-- TODO put urls in a config file
-- TODO query using a template library?
-- TODO only one query parameter is allowed now
