module Main (main) where

import System.Directory (setCurrentDirectory)
import System.Environment (getArgs, getExecutablePath)
import System.FilePath (takeDirectory)

import Agrippa.Main (agrippadDriver)

main :: IO ()
main = do
  args <- getArgs
  workDir <- case args of
    [path] -> return path
    _      -> takeDirectory <$> getExecutablePath
  putStrLn ("Setting work directory to " ++ workDir ++ ".")
  setCurrentDirectory workDir
  agrippadDriver
