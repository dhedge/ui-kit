import BigNumber from 'bignumber.js'

import { usePoolManagerLogicData, usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSynthetixV3OraclesUpdate } from 'core-kit/hooks/trading'
import {
  useDepositAllowance,
  useIsVaultDepositLocked,
} from 'core-kit/hooks/trading/deposit-v2'
import { useIsTransactionLoading } from 'core-kit/hooks/trading/use-is-transaction-loading'
import { useHighSlippageCheck, useUserVaultBalance } from 'trading-widget/hooks'

export const useValidDepositButton = () => {
  const {
    address,
    chainId,
    deprecated,
    symbol,
    maintenance,
    maintenanceDeposits,
  } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()

  const { isVaultDepositLocked, isAccountWhitelisted } =
    useIsVaultDepositLocked()
  const poolTokenPrice = usePoolTokenPrice({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const poolBalance = useUserVaultBalance(address)
  const { approve, canSpend } = useDepositAllowance()
  const { needToBeUpdated, updateOracles, isCheckOraclesPending } =
    useSynthetixV3OraclesUpdate({
      disabled: !canSpend,
    })
  const isUpdateOraclesTransactionLoading =
    useIsTransactionLoading('oraclesUpdate')
  const { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed } =
    useHighSlippageCheck()

  const depositValueInUsd = new BigNumber(
    receiveToken.value || '0',
  ).multipliedBy(poolTokenPrice || '0')

  const requiresMinDeposit =
    (poolBalance && poolBalance.balanceInUsdNumber > minDepositUSD) ||
    receiveToken.value === '0'
      ? false
      : depositValueInUsd.lt(minDepositUSD)

  return {
    requiresMinDeposit,
    requiresWhitelist: isVaultDepositLocked && !isAccountWhitelisted,
    requiresApprove: !canSpend,
    requiresUpdate: needToBeUpdated && !!sendToken.value,
    requiresHighSlippageConfirm,
    sendTokenSymbol: sendToken.symbol,
    poolSymbol: symbol,
    minDepositUSD,
    deprecated,
    approve,
    confirmHighSlippage,
    updateOracles,
    slippageToBeUsed,
    isCheckOraclesPending,
    isUpdateOraclesTransactionLoading,
    maintenance: maintenance || maintenanceDeposits,
  }
}
