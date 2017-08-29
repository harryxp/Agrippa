module Agrippa.Plugins.FileSearch (prompt, search) where

import Prelude (Unit, bind, const, discard, pure, unit, (<$), (<>), (>>=))
import Control.Monad.Aff (runAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (JQuery, create, setText)
import Data.String (trim)
import DOM (DOM)
import Network.HTTP.Affjax (AJAX, get)

import Agrippa.Config (Config)

prompt :: forall e. Config
                 -> String
                 -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
prompt _ _ _ = pure "Press <Enter> to search files."

search :: forall e. Config
                 -> String
                 -> (Array JQuery -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
search _ input displayOutput =
  "Searching..." <$
  runAff
    (const (pure unit))
    (\{ response: r } -> buildNodes r >>= displayOutput)
    (get ("/agrippa/file-search/" <> (trim input)))

buildNodes :: forall e. String -> Eff (dom :: DOM | e) (Array JQuery)
buildNodes contents = do
  p <- create "<p>"
  setText contents p
  pure [p]
