import BigNumber from 'bignumber.js'

import { AddressZero } from 'core-kit/const'
import {
  usePoolManagerLogicData,
  usePoolTokenPrice,
  useUserVaultBalance,
} from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAccount } from 'core-kit/hooks/web3'
import { formatToUsd } from 'core-kit/utils'

const DEFAULT_TOKEN_PRICE = '1' // $

export const useRequiresMinDeposit = () => {
  const { account = AddressZero } = useAccount()
  const { address, chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const tokenPrice = usePoolTokenPrice({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const { data: balanceData } = useUserVaultBalance({
    address,
    chainId,
    account,
  })
  const balance = balanceData?.balanceInUsdNumber ?? 0

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
