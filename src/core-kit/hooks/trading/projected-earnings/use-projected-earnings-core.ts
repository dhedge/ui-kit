import { useMemo } from 'react'

import { AddressZero, WBTC_BY_CHAIN_ID, WETH_BY_CHAIN_ID } from 'core-kit/const'
import { useAssetPrice } from 'core-kit/hooks/trading'
import type {
  ApyCurrency,
  ChainId,
  UseProjectedEarningsResult,
} from 'core-kit/types'
import { formatByCurrency } from 'core-kit/utils'

interface ProjectedEarningsVariables {
  currency: ApyCurrency | undefined
  depositValueInUsd: number
  apy: number | undefined
  chainId: ChainId
  disabled?: boolean
}

const USD_PRICE = 1
const DEFAULT_CURRENCY: ApyCurrency = 'USD'

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
}: ProjectedEarningsVariables): Omit<
  UseProjectedEarningsResult,
  'showEarnings'
> => {
  const customAssetAddress =
    currency === 'ETH'
      ? WETH_BY_CHAIN_ID[chainId]?.address
      : currency === 'BTC'
        ? WBTC_BY_CHAIN_ID[chainId]?.address
        : undefined

  const customAssetPrice = useAssetPrice({
    address: customAssetAddress ?? AddressZero,
    chainId,
    disabled: disabled || !apy || !customAssetAddress,
  })

  const apyCurrencyPrice = customAssetAddress
    ? Number(customAssetPrice)
    : USD_PRICE

  return useMemo(
    () =>
      calculateProjectedEarnings({
        depositValueInUsd,
        apy,
        apyCurrencyPrice,
        currency: customAssetAddress ? currency : DEFAULT_CURRENCY,
      }),
    [depositValueInUsd, apy, apyCurrencyPrice, currency, customAssetAddress],
  )
}
