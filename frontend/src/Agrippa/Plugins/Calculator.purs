module Agrippa.Plugins.Calculator (calculate) where

import Prelude (class Show, bind, discard, negate, pure, show, ($), (<$>), (<<<), (<>), (==), (+), (*), (/))

import Control.Alt ((<|>))
import Data.Either (Either(..))
import Data.Foldable (foldl, intercalate)
import Data.Number (fromString)
import Data.List (List(..), toUnfoldable)
import Data.Maybe (Maybe(..))
import Data.String (fromCharArray,trim)
import Text.Parsing.StringParser (ParseError(..), Parser, fail, runParser)
import Text.Parsing.StringParser.Combinators --(many, many1, option)
import Text.Parsing.StringParser.String --(anyDigit, char, eof, skipSpaces)
import Text.Parsing.StringParser.Expr

calculate :: String -> String
calculate = evalExpr <<< parseExpr

-- TODO parens, factor signs
-- TODO try the expr builder

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

data Factor = Factor FactorOp Number
instance showFactor :: Show Factor where
  show (Factor op n) = show op <> show n

parseExpr :: String -> Either ParseError Expr
parseExpr = runParser exprParser

exprParser :: Parser Expr
exprParser = buildExprParser table simpleExprParser

simpleExprParser :: Parser Expr
simpleExprParser = pure $ Expr Nil --between (char '(') (char ')') exprParser

table :: OperatorTable Expr
table = []
{-
table = [ [Prefix (string "-"), Prefix (string "+")]
        , [Infix (string "*") AssocLeft, Infix (string "/") AssocLeft]
        , [Infix (string "+") AssocLeft, Infix (string "-") AssocLeft]
        ]
-}

{-
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
  n <- many1 (anyDigit <|> char '.')
  skipSpaces
  let strNum = (fromCharArray <<< toUnfoldable) n
      maybeNum = fromString strNum
  case maybeNum of
    Nothing -> fail $ "Can't parse " <> strNum <> " to number."
    Just num -> pure $ Factor Mul num

factorParser :: Parser Factor
factorParser = do
  op <- char '*' <|> char '/'
  skipSpaces
  n <- many1 (anyDigit <|> char '.')
  skipSpaces
  let strNum = (fromCharArray <<< toUnfoldable) n
      maybeNum = fromString strNum
  case maybeNum of
    Nothing -> fail $ "Can't parse " <> strNum <> " to number."
    Just num -> pure $ Factor (if op == '*' then Mul else Div) num
-}

evalExpr :: Either ParseError Expr -> String
evalExpr (Left (ParseError e)) = e
evalExpr (Right (Expr Nil)) = "N/A"
evalExpr (Right (Expr terms)) =
  show $ foldl (\acc term -> evalTerm term + acc) 0.0 terms

evalTerm :: Term -> Number
evalTerm (Term op Nil) = 0.0
evalTerm (Term Plus factors) =
  foldl (\acc factor -> evalFactor factor acc) 1.0 factors
evalTerm (Term Minus factors) = negate $ evalTerm (Term Plus factors)

evalFactor :: Factor -> Number -> Number
evalFactor (Factor Mul n) acc = acc * n
evalFactor (Factor Div n) acc = acc / n
