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
  useShouldBeWhitelisted,
} from 'core-kit/hooks/trading/deposit'

import { useHighSlippageCheck, useUserVaultBalance } from 'trading-widget/hooks'

export const useValidDepositButton = () => {
  const { address, chainId, deprecated, symbol } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()

  const { shouldBeWhitelisted, isAccountWhitelisted } = useShouldBeWhitelisted()
  const poolTokenPrice = usePoolTokenPrice({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const poolBalance = useUserVaultBalance(address)
  const { approve, canSpend } = useDepositAllowance()
  const {
    needToBeUpdated,
    updateOracles,
    isPending: isUpdateOraclesPending,
  } = useSynthetixV3OraclesUpdate({
    disabled: !canSpend,
  })
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
    requiresWhitelist: shouldBeWhitelisted && !isAccountWhitelisted,
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
    isUpdateOraclesPending,
  }
}
