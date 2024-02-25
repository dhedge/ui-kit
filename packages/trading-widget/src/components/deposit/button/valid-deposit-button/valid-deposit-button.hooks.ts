import {
  usePoolManagerLogicData,
  usePoolTokenPrice,
  usePoolsDynamic,
} from '@dhedge/core-ui-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelPoolConfigs,
} from '@dhedge/core-ui-kit/hooks/state'
import { useSynthetixV3OraclesUpdate } from '@dhedge/core-ui-kit/hooks/trading'
import {
  useDepositAllowance,
  useShouldBeWhitelisted,
} from '@dhedge/core-ui-kit/hooks/trading/deposit'
import { normalizeNumber } from '@dhedge/core-ui-kit/utils'

import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { useHighSlippageCheck } from 'hooks'

export const useValidDepositButton = () => {
  const configs = useTradingPanelPoolConfigs()
  const { address, chainId, deprecated, symbol } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()

  const { shouldBeWhitelisted, isAccountWhitelisted } = useShouldBeWhitelisted()
  const poolTokenPrice = usePoolTokenPrice({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const { data: poolsMap } = usePoolsDynamic(configs)
  const { approve, canSpend } = useDepositAllowance()
  const { needToBeUpdated, updateOracles } = useSynthetixV3OraclesUpdate({
    disabled: !canSpend,
  })
  const { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed } =
    useHighSlippageCheck()

  const depositValueInUsd = new BigNumber(
    receiveToken.value || '0',
  ).multipliedBy(poolTokenPrice || '0')

  const poolBalanceInUsdNumber = useMemo(() => {
    const pool = poolsMap?.[address]

    return (
      normalizeNumber(pool?.userBalance ?? 0) *
      normalizeNumber(pool?.tokenPrice ?? 0)
    )
  }, [poolsMap, address])

  const isLowerThanMinDeposit =
    poolBalanceInUsdNumber < minDepositUSD ||
    depositValueInUsd.lt(minDepositUSD)

  return {
    requiresMinDeposit:
      receiveToken.value === '0' ? false : isLowerThanMinDeposit,
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
  }
}
