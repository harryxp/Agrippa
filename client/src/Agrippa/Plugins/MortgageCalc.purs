module Agrippa.Plugins.MortgageCalc (mortgageCalc) where

import Prelude (bind, discard, flip, pure, unit, (+), (-), (*), (/), (>=), (<$>), (<>))
import Data.Array (reverse, (:))
import Data.Maybe (Maybe(..))
import Data.Number (fromString)
import Data.Number.Format (fixed, toStringWith)
import Data.String (trim)
import Data.String.Utils (words)
import Data.Traversable (traverse, traverse_)
import Effect (Effect)
import JQuery (JQuery, addClass, append, create, setText)
import Math (pow)

import Agrippa.Config (Config)
import Agrippa.Plugins.PluginType (Plugin(..))
import Agrippa.Utils (createTextNode)

mortgageCalc :: Plugin
mortgageCalc = Plugin { name: "Mortgage Calculator"
                      , prompt: showUsage
                      , promptAfterKeyTimeout: \_ _ _ _ -> pure unit
                      , activate: calculateMortgage
                      }

showUsage :: String -> Config -> String -> Effect (Maybe JQuery)
showUsage _ _ _ = do
  n1 <- createTextNode "<Loan Amount> <Interest Rate (%)> <Mortgage Period (years)>"
  n2 <- createTextNode "E.g.: 300000 4 30<Enter>"
  container <- create "<div>"
  append n1 container
  append n2 container
  pure (Just container)

type Params = { loanAmount   :: Number
              , interestRate :: Number
              , periodInYear :: Number
              }

calculateMortgage :: String -> Config -> String -> Effect (Maybe JQuery)
calculateMortgage _ _ input =
  case words (trim input) of
    [loanAmountStr, interestRateStr, periodInYearStr] ->
      case parseInput loanAmountStr interestRateStr periodInYearStr of
        Just { loanAmount, interestRate, periodInYear } ->
          let interestRatePercent = interestRate / 100.0
              monthlyPayment = calcMonthlyPayment loanAmount interestRatePercent periodInYear
              amortization = calculateAmortization monthlyPayment loanAmount interestRatePercent periodInYear
          in do
              container <- create "<div>"
              div1      <- create "<div>"
              setText ("Monthly payment is: " <> truncate2 monthlyPayment <> ".") div1
              div2      <- create "<div>"
              setText ("Amortizaton:") div2
              table     <- buildTable amortization
              append div1 container
              append div2 container
              append table container
              pure (Just container)
        Nothing -> Just <$> createTextNode "Failed to parse input parameter(s)."
    otherwise -> Just <$> createTextNode "Failed to parse input parameter(s)."

parseInput :: String -> String -> String -> Maybe Params
parseInput loanAmountStr interestRateStr periodInYearStr = do
  loanAmount   <- fromString loanAmountStr
  interestRate <- fromString interestRateStr
  periodInYear <- fromString periodInYearStr
  Just { loanAmount, interestRate, periodInYear }

calcMonthlyPayment :: Number -> Number -> Number -> Number
calcMonthlyPayment loanAmount interestRate periodInYear = (r - 1.0) / (pow r (12.0 * periodInYear + 1.0) - r) * loanAmount
  where r = 1.0 / (1.0 + interestRate / 12.0)

type MonthlyInstallment = { installmentNumber :: Number
                          , principal         :: Number
                          , interest          :: Number
                          , balance           :: Number
                          }

calculateAmortization :: Number -> Number -> Number -> Number -> Array MonthlyInstallment
calculateAmortization monthlyPayment loanAmount interestRate periodInYear =
  calculateAmortization' 0.0 loanAmount [initialState]
  where
    initialState = { installmentNumber: 0.0
                   , principal        : 0.0
                   , interest         : 0.0
                   , balance          : loanAmount
                   }
    calculateAmortization' installmentNumber balance accum =
      if installmentNumber >= periodInYear * 12.0
      then reverse accum
      else
        let interest = balance * (interestRate / 12.0)
            principal = monthlyPayment - interest
            newBalance = balance * (1.0 + interestRate / 12.0) - monthlyPayment
        in calculateAmortization'
            (installmentNumber + 1.0)
            newBalance
            ({ installmentNumber: (installmentNumber + 1.0)
             , principal        : principal
             , interest         : interest
             , balance          : newBalance
             } : accum)

buildTable :: Array MonthlyInstallment -> Effect JQuery
buildTable installments = do
  table  <- create "<table>"
  header <- buildTableHeader
  rows   <- traverse buildTableRow installments :: Effect (Array JQuery)
  append header table
  traverse_ (flip append table) rows
  pure table

buildTableHeader :: Effect JQuery
buildTableHeader = do
  th1 <- create "<th>"
  setText "Installment #" th1
  th2 <- create "<th>"
  setText "Principal" th2
  th3 <- create "<th>"
  setText "Interest" th3
  th4 <- create "<th>"
  setText "Balance" th4

  tr <- create "<tr>"
  append th1 tr
  append th2 tr
  append th3 tr
  append th4 tr
  pure tr


buildTableRow :: MonthlyInstallment -> Effect JQuery
buildTableRow { installmentNumber, principal, interest, balance } = do
  td1 <- create "<td>"
  setText (truncate0 installmentNumber) td1
  td2 <- create "<td>"
  setText (truncate2 principal) td2
  td3 <- create "<td>"
  setText (truncate2 interest) td3
  td4 <- create "<td>"
  setText (truncate2 balance) td4

  tr <- create "<tr>"
  append td1 tr
  append td2 tr
  append td3 tr
  append td4 tr
  addClass "agrippa-mortgage-calc-tr" tr
  pure tr

truncate0 :: Number -> String
truncate0 n = toStringWith (fixed 0) n

truncate2 :: Number -> String
truncate2 n = toStringWith (fixed 2) n
