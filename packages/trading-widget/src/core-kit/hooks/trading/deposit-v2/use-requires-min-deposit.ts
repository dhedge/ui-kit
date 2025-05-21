import BigNumber from 'bignumber.js'

import { usePoolManagerLogicData, usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { formatToUsd } from 'core-kit/utils'
import { useUserVaultBalance } from 'trading-widget/hooks'

const DEFAULT_TOKEN_PRICE = '1' // $

export const useRequiresMinDeposit = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const tokenPrice = usePoolTokenPrice({ address })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const balance = useUserVaultBalance(address)?.balanceInUsdNumber ?? 0

  // Use default price for newly created vaults without deposits
  const tokenPriceToUse = tokenPrice === '0' ? DEFAULT_TOKEN_PRICE : tokenPrice

  const requiredMinDepositAmount = Math.max(0, minDepositUSD - balance)
  const depositValueInUsd = new BigNumber(
    receiveToken.value || '0',
  ).multipliedBy(tokenPriceToUse)

  const requiresMinDeposit = depositValueInUsd.isZero()
    ? false
    : depositValueInUsd.lte(requiredMinDepositAmount)

  return {
    requiresMinDeposit,
    requiredMinDepositAmount: formatToUsd({ value: requiredMinDepositAmount }),
  }
}
