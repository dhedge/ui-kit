import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import {
  useDepositAllowance,
  useIsVaultDepositLocked,
  useRequiresMinDeposit,
} from 'core-kit/hooks/trading/deposit-v2'
import { useHighSlippageCheck } from 'trading-widget/hooks'

export const useValidDepositButton = () => {
  const { deprecated, symbol, maintenance, maintenanceDeposits } =
    useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()

  const { isVaultDepositLocked, isAccountWhitelisted } =
    useIsVaultDepositLocked()
  const { approve, canSpend } = useDepositAllowance()
  const { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed } =
    useHighSlippageCheck()
  const { requiresMinDeposit, requiredMinDepositAmount } =
    useRequiresMinDeposit()

  return {
    requiresMinDeposit,
    requiresWhitelist: isVaultDepositLocked && !isAccountWhitelisted,
    requiresApprove: !canSpend,
    requiresHighSlippageConfirm,
    sendTokenSymbol: sendToken.symbol,
    poolSymbol: symbol,
    requiredMinDepositAmount,
    deprecated,
    approve,
    confirmHighSlippage,
    slippageToBeUsed,
    maintenance: maintenance || maintenanceDeposits,
  }
}
