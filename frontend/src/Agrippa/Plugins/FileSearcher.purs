module Agrippa.Plugins.FileSearcher where -- TODO

import Prelude
import Control.Monad.Aff
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (EXCEPTION, throwException)
import Control.Monad.Eff.JQuery
import DOM (DOM)
import Network.HTTP.Affjax
import Network.HTTP.Affjax.Response
import Unsafe.Coerce (unsafeCoerce)

search :: forall e. String
                 -> (AffjaxResponse String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                 -> Eff (ajax :: AJAX, dom :: DOM | e) String
search input displayResult = "Searching..." <$ searchPrototype input displayResult

raf :: Eff (ajax :: AJAX) (Canceler (ajax :: AJAX))
raf = runAff (const (pure unit)) (const (pure unit)) af

af :: forall e. Aff (ajax :: AJAX | e) (AffjaxResponse String)
af = get "/agrippa/file-search/pure"


searchPrototype :: forall e. String
                          -> (AffjaxResponse String -> Eff (ajax :: AJAX, dom :: DOM | e) Unit)
                          -> Eff (ajax :: AJAX, dom :: DOM | e) (Canceler (ajax :: AJAX, dom :: DOM | e))
searchPrototype input displayResult = runAff (const (pure unit)) displayResult af




--unsafeCoerce unit
