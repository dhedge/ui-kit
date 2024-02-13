import { AddressZero, WETH_BY_CHAIN_ID } from 'const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelPoolFallbackData,
  useTradingPanelType,
} from 'hooks/state'
import { useAssetPrice } from 'hooks/trading'

import type { ApyCurrency } from 'types'
import { formatByCurrency } from 'utils'

interface UseProjectedEarningsResult {
  dailyEarnings: string | null
  yearlyEarnings: string | null
  showEarnings: boolean
}

const USD_PRICE = 1

const calculateProjectedEarnings = ({
  totalDepositedInUsd,
  apy,
  apyCurrencyPrice,
  currency,
}: {
  totalDepositedInUsd: number
  apy: number
  apyCurrencyPrice: number
  currency: ApyCurrency
}): UseProjectedEarningsResult => {
  if (totalDepositedInUsd === 0) {
    return {
      showEarnings: true,
      yearlyEarnings: '-',
      dailyEarnings: '-',
    }
  }
  const yearlyEarnings = (totalDepositedInUsd * apy) / 100 / apyCurrencyPrice
  return {
    showEarnings: true,
    yearlyEarnings: formatByCurrency({ value: yearlyEarnings, currency }),
    dailyEarnings: formatByCurrency({ value: yearlyEarnings / 365, currency }),
  }
}

export const useProjectedEarnings = (): UseProjectedEarningsResult => {
  const isDepositType = useTradingPanelType()[0] === 'deposit'
  const { chainId } = useTradingPanelPoolConfig()
  const [poolFallbackData] = useTradingPanelPoolFallbackData()
  const [sendToken] = useSendTokenInput()
  const sendTokenPrice = useAssetPrice({
    address: sendToken.address,
    chainId,
    disabled: !isDepositType || !poolFallbackData.apy,
  })
  const isEthApyCurrency = poolFallbackData.apy?.currency === 'ETH'
  const ethPrice = useAssetPrice({
    address: WETH_BY_CHAIN_ID[chainId]?.address ?? AddressZero,
    chainId,
    disabled: !isEthApyCurrency,
  })
  const apyCurrencyPrice = isEthApyCurrency ? +ethPrice : USD_PRICE

  if (!poolFallbackData.apy || !isDepositType) {
    return { dailyEarnings: null, yearlyEarnings: null, showEarnings: false }
  }

  return calculateProjectedEarnings({
    totalDepositedInUsd: +sendToken.value * +sendTokenPrice,
    apy: poolFallbackData.apy.value,
    apyCurrencyPrice,
    currency: poolFallbackData.apy.currency,
  })
}
