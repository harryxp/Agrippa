module Agrippa.Plugins.Registry (Plugin(..), plugins) where

-- TODO load plugins dynamically
import Agrippa.Plugins.Calculator as Calc

newtype Plugin = Plugin { name        :: String
                        , keyword     :: String
                        , computation :: String -> String
                        }

plugins :: Array Plugin
plugins = [ Plugin { name: "Calculator", keyword: "=", computation: Calc.calculate }
          ]

