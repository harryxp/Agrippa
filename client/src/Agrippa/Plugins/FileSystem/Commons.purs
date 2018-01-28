module Agrippa.Plugins.FileSystem.Commons (launch, suggest) where

import Prelude (Unit, bind, const, discard, pure, show, unit, (<$), (<$>), (<>), (>>=), (<=<), (<<<))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, addClass, append, create, setAttr, setText)
import Data.Argonaut.Core (Json, fromObject, fromString, toArray, toString)
import Data.Array (drop, take, zipWith, (..))
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.String (trim)
import Data.StrMap (empty, insert)
import Data.Traversable (sequence, traverse)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, post)

import Agrippa.Config (Config, getBooleanVal)

suggest :: forall e. String
                  -> String
                  -> String
                  -> Config
                  -> String
                  -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                  -> Eff (ajax :: AJAX, dom :: DOM | e) String
suggest suggestUrl openUrl taskName config input displayOutput =
  let eitherEff = do
        useFunctionKeys <- getBooleanVal  "useFunctionKeys" config
        pure ("Searching..." <$
              runAff
                (const (pure unit))
                (\{ response: r } -> buildOutputNodes useFunctionKeys openUrl r >>= displayOutput)
                (post suggestUrl (buildSuggestReq taskName (trim input))))
  in case eitherEff of
      Left  err -> pure err
      Right eff -> eff

buildSuggestReq :: String -> String -> Json
buildSuggestReq taskName term = (fromObject <<<
                                 insert "taskName" (fromString taskName) <<<
                                 insert "term"     (fromString term)) empty

numOfShortcuts :: Int
numOfShortcuts = 9

buildOutputNodes :: forall e. Boolean
                           -> String
                           -> Json
                           -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildOutputNodes useFunctionKeys openUrl contents =
  case (traverse toString <=< toArray) contents of
    Just items -> do
      nodesWithShortcuts <- buildNodesWithShortcuts useFunctionKeys openUrl (take numOfShortcuts items)
      otherNodes         <- sequence ((\item -> do
        link <- buildLink item openUrl
        div  <- create "<div>"
        append link div
        pure div) <$> drop numOfShortcuts items)
      pure (nodesWithShortcuts <> otherNodes)
    Nothing       -> do
      div <- create "<div>"
      setText "Error: expect a JSON array of strings from server." div
      pure [div]

buildNodesWithShortcuts :: forall e. Boolean
                                  -> String
                                  -> Array String
                                  -> Eff (ajax :: AJAX, dom :: DOM | e) (Array JQuery)
buildNodesWithShortcuts useFunctionKeys openUrl items = do
  nodes <- sequence
    (zipWith
      (\index item -> do
        link <- buildLink item openUrl
        span <- create "<span>"
        addClass "shortcut-prompt" span
        setText ("ctrl-" <> (if useFunctionKeys then "f" else "") <> show index) span
        div  <- create "<div>"
        append link div
        append span div
        pure div)
     (1..numOfShortcuts)
     items)
  reinstallShortcuts useFunctionKeys openUrl items
  pure nodes

buildLink :: forall e. String -> String -> Eff (dom :: DOM | e) JQuery
buildLink item openUrl = do
  link <- create "<a>"
  setText item link
  setAttr "href" (openUrl <> "?item=" <> item) link
  pure link

foreign import reinstallShortcuts :: forall e. Boolean
                                            -> String
                                            -> Array String
                                            -> Eff (ajax :: AJAX, dom :: DOM | e) Unit

launch :: forall e. String
                 -> String
                 -> Config
                 -> String
                 -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
launch _ _ _ _ _ = pure "Please use shortcuts."

