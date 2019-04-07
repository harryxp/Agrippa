module Agrippa.Plugins.Registry (namesToPlugins) where

import Prelude ((<$>))
import Data.Map (Map, fromFoldable)
import Data.Tuple (Tuple(..))

import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Plugins.Calculator (calculator)
import Agrippa.Plugins.Clock (clock)
import Agrippa.Plugins.FileSystem.LinuxFileSearch (linuxFileSearch)
import Agrippa.Plugins.FileSystem.MacAppSearch (macAppSearch)
import Agrippa.Plugins.FileSystem.MacFileSearch (macFileSearch)
import Agrippa.Plugins.FileSystem.UnixExecutableSearch (unixExecutableSearch)
import Agrippa.Plugins.FileSystem.WinExecutableSearch (winExecutableSearch)
import Agrippa.Plugins.FileSystem.WinFileSearch (winFileSearch)
import Agrippa.Plugins.TaskSearch (taskSearch)
import Agrippa.Plugins.KeePass1 (keePass1)
import Agrippa.Plugins.MortgageCalc (mortgageCalc)
import Agrippa.Plugins.OnlineSearch (onlineSearch)
import Agrippa.Plugins.Snippets (snippets)

-- All known plugins.  Not necessarily all loaded.
-- Loaded ones are specified in the config file.
plugins :: Array Plugin
plugins = [ calculator
          , clock
          , taskSearch
          , mortgageCalc
          , onlineSearch
          , snippets
          -- the following plugins use the backend heavily
          , linuxFileSearch
          , macAppSearch
          , macFileSearch
          , unixExecutableSearch
          , winExecutableSearch
          , winFileSearch
          , keePass1
          ]

namesToPlugins :: Map String Plugin
namesToPlugins = fromFoldable ((\p@(Plugin { name: n }) -> Tuple n p) <$> plugins)
