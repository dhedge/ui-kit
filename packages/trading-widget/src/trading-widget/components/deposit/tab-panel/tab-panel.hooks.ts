import {
  useDepositQuote,
  useDepositSlippage,
} from 'core-kit/hooks/trading/deposit-v2'

export const useDepositTabPanel = () => {
  useDepositQuote()
  useDepositSlippage()
}
