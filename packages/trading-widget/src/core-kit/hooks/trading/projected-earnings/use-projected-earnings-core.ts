import { AddressZero, WETH_BY_CHAIN_ID } from 'core-kit/const'
import { useAssetPrice } from 'core-kit/hooks/trading'
import type {
  ApyCurrency,
  ChainId,
  UseProjectedEarningsResult,
} from 'core-kit/types'
import { formatByCurrency, isZeroAddress } from 'core-kit/utils'

interface ProjectedEarningsVariables {
  currency: ApyCurrency | undefined
  depositValueInUsd: number
  apy: number | undefined
  chainId: ChainId
  disabled?: boolean
}

const USD_PRICE = 1

const calculateProjectedEarnings = ({
  depositValueInUsd,
  apy,
  apyCurrencyPrice,
  currency,
}: {
  depositValueInUsd: number
  apy: number | undefined
  apyCurrencyPrice: number
  currency: ApyCurrency | undefined
}): Omit<UseProjectedEarningsResult, 'showEarnings'> => {
  if (depositValueInUsd === 0 || !apy || !currency || apyCurrencyPrice === 0) {
    return {
      yearlyEarnings: '-',
      dailyEarnings: '-',
      monthlyEarnings: '-',
    }
  }
  const yearlyEarnings = (depositValueInUsd * apy) / 100 / apyCurrencyPrice

  return {
    yearlyEarnings: formatByCurrency({ value: yearlyEarnings, currency }),
    dailyEarnings: formatByCurrency({ value: yearlyEarnings / 365, currency }),
    monthlyEarnings: formatByCurrency({ value: yearlyEarnings / 12, currency }),
  }
}

export const useProjectedEarningsCore = ({
  currency,
  depositValueInUsd,
  chainId,
  apy,
  disabled,
}: ProjectedEarningsVariables) => {
  const isEthApyCurrency = currency === 'ETH'
  const ethPrice = useAssetPrice({
    address: WETH_BY_CHAIN_ID[chainId]?.address ?? AddressZero,
    chainId,
    disabled:
      disabled ||
      !apy ||
      !isEthApyCurrency ||
      isZeroAddress(WETH_BY_CHAIN_ID[chainId]?.address ?? AddressZero),
  })
  const apyCurrencyPrice = isEthApyCurrency ? +ethPrice : USD_PRICE

  return calculateProjectedEarnings({
    depositValueInUsd,
    apy,
    apyCurrencyPrice,
    currency,
  })
}
