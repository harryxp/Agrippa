module Agrippa.Plugins.Calculator  where -- TODO export only process

import Prelude (class Show, bind, discard, id, negate, pure, show, ($), (<$>), (<<<), (<>), (==), (+), (*), (/))

import Control.Alt ((<|>))
import Data.Either (Either(..))
import Data.Foldable (foldl, intercalate)
import Data.Int (fromString)
import Data.List (List(..), toUnfoldable)
import Data.Maybe (Maybe(..))
import Data.String (fromCharArray,trim)
import Text.Parsing.StringParser (ParseError(..), Parser, fail, runParser)
import Text.Parsing.StringParser.Combinators (many, many1, option)
import Text.Parsing.StringParser.String (anyDigit, char, eof, skipSpaces)

process :: String -> String
process = evalExpr <<< parseExpr


-- TODO parens, floating numbers, factor signs
-- TODO deriving Show?
data Expr = Expr (List Term)
instance showExpr :: Show Expr where
  show (Expr terms) = "Expr\n" <> intercalate "\n" (show <$> terms)

data TermOp = Plus | Minus
instance showTermOp :: Show TermOp where
  show Plus = "+"
  show Minus = "-"

data Term = Term TermOp (List Factor)
instance showTerm :: Show Term where
  show (Term op factors) =
    show op <> "Term " <> intercalate " " (show <$> factors)

data FactorOp = Mul | Div
instance showFactorOp :: Show FactorOp where
  show Mul = "*"
  show Div = "/"

data Factor = Factor FactorOp Int
instance showFactor :: Show Factor where
  show (Factor op n) = show op <> show n

parseExpr :: String -> Either ParseError Expr
parseExpr = runParser exprParser <<< trim

exprParser :: Parser Expr
exprParser = do
  initialTerm <- initialTermParser
  terms <- many termParser
  eof
  pure $ Expr (Cons initialTerm terms)

initialTermParser :: Parser Term
initialTermParser = do
  op <- option '+' (char '+' <|> char '-')
  skipSpaces
  initialFactor <- initialFactorParser
  factors <- many factorParser
  skipSpaces
  pure $ Term (if op == '+' then Plus else Minus) (Cons initialFactor factors)

termParser :: Parser Term
termParser = do
  op <- char '+' <|> char '-'
  skipSpaces
  initialFactor <- initialFactorParser
  factors <- many factorParser
  skipSpaces
  pure $ Term (if op == '+' then Plus else Minus) (Cons initialFactor factors)

initialFactorParser :: Parser Factor
initialFactorParser = do
  n <- many1 anyDigit
  skipSpaces
  let maybeNum = (fromString <<< fromCharArray <<< toUnfoldable) n
  case maybeNum of
    Nothing -> fail "Can't parse digits to number."
    Just num -> pure $ Factor Mul num

factorParser :: Parser Factor
factorParser = do
  op <- char '*' <|> char '/'
  skipSpaces
  n <- many1 anyDigit
  skipSpaces
  let maybeNum = (fromString <<< fromCharArray <<< toUnfoldable) n
  case maybeNum of
    Nothing -> fail "Can't parse digits to number."
    Just num -> pure $ Factor (if op == '*' then Mul else Div) num

evalExpr :: Either ParseError Expr -> String
evalExpr (Left (ParseError e)) = e
evalExpr (Right (Expr Nil)) = "N/A"
evalExpr (Right (Expr terms)) =
  show $ foldl (\acc term -> evalTerm term + acc) 0 terms

evalTerm :: Term -> Int
evalTerm (Term op Nil) = 0
evalTerm (Term op factors) =
  let negateOrNot = case op of
                      Plus -> id
                      Minus -> negate
  in negateOrNot $ foldl (\acc factor -> evalFactor factor * acc) 1 factors

evalFactor :: Factor -> Int
evalFactor (Factor Mul n) = n
evalFactor (Factor Div n) = 1 / n   -- TODO
