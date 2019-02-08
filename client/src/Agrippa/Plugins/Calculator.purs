module Agrippa.Plugins.Calculator (calculator) where

import Prelude (class Show, Unit, bind, map, identity, negate, pure, show, ($>), (*), (+), (-), (/), (<<<), (<>))
import Control.Alt ((<|>))
import Data.Either (Either(..))
import Data.List.NonEmpty (toUnfoldable)
import Data.Maybe (Maybe(..))
import Data.Number (fromString)
import Data.String (Pattern(..), Replacement(..), fromCodePointArray, replaceAll)
import Data.String.CodePoints (codePointFromChar)
import Effect (Effect)
import JQuery (JQuery)
import Text.Parsing.StringParser (ParseError(..), Parser, fail, runParser)
import Text.Parsing.StringParser.CodePoints (anyDigit, char, string)
import Text.Parsing.StringParser.Combinators (between, fix, many1)
import Text.Parsing.StringParser.Expr (Assoc(..), Operator(..), OperatorTable, buildExprParser)

import Agrippa.Config (Config)
import Agrippa.Plugins.Base (Plugin(..))
import Agrippa.Utils (createTextNode)

calculator :: Plugin
calculator = Plugin { name: "Calculator"
                    , onInputChange: calculate
                    , onActivation: \_ _ _ -> pure Nothing
                    }

calculate :: String -> Config -> String -> (JQuery -> Effect Unit) -> Effect (Maybe JQuery)
calculate _ _ input _ = (map Just <<< createTextNode <<< evalExpr <<< parseExpr <<< (replaceAll (Pattern " ") (Replacement ""))) input

data Expr = ExprAdd Expr Expr
          | ExprSub Expr Expr
          | ExprMul Expr Expr
          | ExprDiv Expr Expr
          | ExprNeg Expr
          | ExprParens Expr
          | ExprNum Number
instance showExpr :: Show Expr where
  show (ExprAdd e1 e2) = "(" <> show e1 <> "+" <> show e2 <> ")"
  show (ExprSub e1 e2) = "(" <> show e1 <> "-" <> show e2 <> ")"
  show (ExprMul e1 e2) = "(" <> show e1 <> "*" <> show e2 <> ")"
  show (ExprDiv e1 e2) = "(" <> show e1 <> "/" <> show e2 <> ")"
  show (ExprNeg e)     = "-" <> show e
  show (ExprParens e)  = "(" <> show e <> ")"
  show (ExprNum n)    = show n

parseExpr :: String -> Either ParseError Expr
parseExpr = runParser exprParser

exprParser :: Parser Expr
exprParser = fix (\p -> buildExprParser table (exprParensParser p <|> exprNumParser))

exprParensParser :: Parser Expr -> Parser Expr
exprParensParser p = between (string "(") (string ")") p

exprNumParser :: Parser Expr
exprNumParser = do
  n <- many1 (anyDigit <|> char '.')
  let strNum = (fromCodePointArray <<< toUnfoldable <<< (map codePointFromChar)) n
      numMb  = fromString strNum
  case numMb of
    Nothing  -> fail ("Can't parse " <> strNum <> " to number.")
    Just num -> pure (ExprNum num)

table :: OperatorTable Expr
table = [ [Prefix (string "-" $> ExprNeg), Prefix (string "+" $> identity)]
        , [Infix (string "*" $> ExprMul) AssocLeft, Infix (string "/" $> ExprDiv) AssocLeft]
        , [Infix (string "+" $> ExprAdd) AssocLeft, Infix (string "-" $> ExprSub) AssocLeft]
        ]

evalExpr :: Either ParseError Expr -> String
evalExpr (Left (ParseError _)) = "Invalid expression."
evalExpr (Right e) = show (evalExpr' e)

evalExpr' :: Expr -> Number
evalExpr' (ExprAdd e1 e2) = evalExpr' e1 + evalExpr' e2
evalExpr' (ExprSub e1 e2) = evalExpr' e1 - evalExpr' e2
evalExpr' (ExprMul e1 e2) = evalExpr' e1 * evalExpr' e2
evalExpr' (ExprDiv e1 e2) = evalExpr' e1 / evalExpr' e2
evalExpr' (ExprNeg e)     = -(evalExpr' e)
evalExpr' (ExprParens e)  = evalExpr' e
evalExpr' (ExprNum n)     = n
