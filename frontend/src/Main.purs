module Main where

import Prelude (class Show, Unit, bind, discard, pure, show, ($), (<<<), (<>), (==))

import Control.Alt ((<|>))
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE)
import Control.Monad.Eff.JQuery (JQuery, JQueryEvent, getValue, on, ready, select, setText)
import Control.Monad.Except (runExcept)
import DOM (DOM)
import Data.Either (Either)
import Data.Foldable (for_)
import Data.Foreign (readString)
import Data.Int (fromString)
import Data.List (List(Cons), toUnfoldable)
import Data.Maybe (Maybe(..))
import Data.String (fromCharArray, uncons)
import Text.Parsing.StringParser (ParseError, Parser, fail, runParser)
import Text.Parsing.StringParser.Combinators (many, many1, option)
import Text.Parsing.StringParser.String (anyDigit, char, skipSpaces)

main :: forall e. Eff (dom :: DOM, console :: CONSOLE | e) Unit
main = ready $ do
  agrippaInput <- select "#agrippa-input"
  on "input" handleAgrippaInput agrippaInput

handleAgrippaInput :: forall e. JQueryEvent -> JQuery -> Eff (dom :: DOM, console :: CONSOLE | e) Unit
handleAgrippaInput _ elem = do
  v <- getValue elem
  statusArea <- select "#status"
  for_ (runExcept (readString v)) \s ->
    let status = case uncons s of
          Nothing -> "Awaiting user input."
          Just { head : '=', tail : e } -> evalExpression e
          Just _ -> "No suitable plugin."
    in setText status statusArea

evalExpression :: String -> String
evalExpression = evalExpr <<< parseExpr


-- TODO parens, floating numbers, factor signs
-- TODO deriving Show?
data Expr = Expr (List Term)
instance showExpr :: Show Expr where
  show (Expr terms) = "Expr " <> show terms

data TermOp = Plus | Minus
data Term = Term TermOp (List Factor)
instance showTerm :: Show Term where
  show (Term Plus factors) = "+Term " <> show factors
  show (Term Minus factors) = "-Term " <> show factors

data FactorOp = Mul | Div
data Factor = Factor FactorOp Int
instance showFactor :: Show Factor where
  show (Factor Mul n) = "*" <> show n
  show (Factor Div n) = "/" <> show n

parseExpr :: String -> Either ParseError Expr
parseExpr = runParser exprParser

exprParser :: Parser Expr
exprParser = do
  initialTerm <- initialTermParser
  terms <- many termParser
  pure $ Expr (Cons initialTerm terms)

initialTermParser :: Parser Term
initialTermParser = do
  skipSpaces
  op <- option '+' (char '+' <|> char '-')
  skipSpaces
  initialFactor <- initialFactorParser
  factors <- many factorParser
  pure $ Term (if op == '+' then Plus else Minus) (Cons initialFactor factors)

termParser :: Parser Term
termParser = do
  skipSpaces
  op <- char '+' <|> char '-'
  skipSpaces
  initialFactor <- initialFactorParser
  factors <- many factorParser
  pure $ Term (if op == '+' then Plus else Minus) (Cons initialFactor factors)

initialFactorParser :: Parser Factor
initialFactorParser = do
  skipSpaces
  n <- many1 anyDigit
  let maybeNum = (fromString <<< fromCharArray <<< toUnfoldable) n
  case maybeNum of
    Nothing -> fail "Can't parse digits to number."
    Just num -> pure $ Factor Mul num

factorParser :: Parser Factor
factorParser = do
  skipSpaces
  op <- char '*' <|> char '/'
  skipSpaces
  n <- many1 anyDigit
  let maybeNum = (fromString <<< fromCharArray <<< toUnfoldable) n
  case maybeNum of
    Nothing -> fail "Can't parse digits to number."
    Just num -> pure $ Factor (if op == '*' then Mul else Div) num

evalExpr :: Either ParseError Expr -> String
evalExpr _ = ""

{--
evalExpr :: Either ParseError Expr -> String
evalExpr (Left (ParseError e)) = e
evalExpr (Right (Expr Nil)) = "N/A"
evalExpr (Right (Expr terms)) = show $ foldl (\acc term -> evalTerm term + acc) 0 terms

evalTerm :: Term -> Int
evalTerm (Term op Nil) = 0
evalTerm (Term op factors) = foldl (\acc factor -> evalFactor factor * acc) 1 factors

evalFactor :: Factor -> Int
evalFactor (Factor Mul n) = n
evalFactor (Factor Div n) = 1 / n   -- TODO
--}
