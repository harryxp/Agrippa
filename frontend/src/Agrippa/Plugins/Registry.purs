module Agrippa.Plugins.Registry (Plugin(..), plugins) where

import Agrippa.Plugins.Calculator as Calc
import Agrippa.Plugins.FileSearcher as F

newtype Plugin = Plugin { name        :: String
                        , keyword     :: String
                        , computation :: String -> String
                        }

plugins :: Array Plugin
plugins = [ Plugin { name: "Calculator", keyword: "=", computation: Calc.calculate }
          , Plugin { name: "FileSearcher", keyword: "'", computation: F.search }
          ]

-- TODO load plugins dynamically
