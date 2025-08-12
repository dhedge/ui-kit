import BigNumber from 'bignumber.js'

import {
  CURRENCY_DECIMALS_MAP,
  CURRENCY_SYMBOL_MAP,
  DEFAULT_PRECISION,
} from 'core-kit/const'

import type { ApyCurrency, Balance } from 'core-kit/types'

import { getPercent, isNumeric, normalizeNumber } from 'core-kit/utils/number'
import { formatUnits } from 'core-kit/utils/web3'

export const formatPercentage = (value: number, maximumFractionDigits = 0) =>
  `${value.toLocaleString('en-US', { maximumFractionDigits })}%`

export const formatToUsd = ({
  value,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  compact = false,
  normalize = false,
}: {
  value: number | string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  compact?: boolean
  normalize?: boolean
}): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(normalize ? normalizeNumber(value) : Number(value))

export const formatNumeratorToPercentage = (
  numerator: number | string,
  denominator: number,
  maximumFractionDigits = 0,
): string => {
  const percent = getPercent(+numerator, denominator)
  return formatPercentage(percent, maximumFractionDigits)
}

export const removeInsignificantTrailingZeros = (value: string): string =>
  isNumeric(value) ? new BigNumber(value).toFixed() : ''

export const formatNumberToLimitedDecimals = (
  value: number | string,
  decimals: number,
): string =>
  removeInsignificantTrailingZeros(new BigNumber(value).toFixed(decimals))

export const formatByCurrency = ({
  currency,
  value,
}: {
  currency: ApyCurrency
  value: number
}) => {
  if (currency === 'USD') {
    return formatToUsd({ value })
  }

  return `${CURRENCY_SYMBOL_MAP[currency]} ${formatNumberToLimitedDecimals(
    value,
    CURRENCY_DECIMALS_MAP[currency],
  )}`
}

export const formatBalance = (value: string, precision: number) =>
  new BigNumber(
    new BigNumber(value).toFixed(precision, BigNumber.ROUND_DOWN),
  ).toString()

const nonZeroBigInt = (value: unknown): value is bigint =>
  typeof value === 'bigint' && value !== BigInt(0)

export function formatBalanceInUsd(
  balance: string | undefined,
  tokenPrice: string | undefined,
  maximumFractionDigits?: number,
): { balanceInUsd: string; balanceInUsdNumber: number } {
  if (!balance || !tokenPrice) {
    return {
      balanceInUsd: '',
      balanceInUsdNumber: 0,
    }
  }

  const balanceInUsdNumber = +balance * normalizeNumber(tokenPrice)
  return {
    balanceInUsd: formatToUsd({
      value: balanceInUsdNumber,
      maximumFractionDigits,
    }),
    balanceInUsdNumber,
  }
}

export const formatVaultBalance = (
  balance: bigint | undefined,
  tokenPrice: bigint | undefined,
): Balance => {
  if (nonZeroBigInt(balance)) {
    return {
      rawBalance: balance?.toString() ?? '',
      ...formatBalanceInUsd(
        formatUnits(balance, DEFAULT_PRECISION),
        tokenPrice?.toString(),
      ),
    }
  }

  return {
    rawBalance: '',
    balanceInUsd: '',
    balanceInUsdNumber: 0,
  }
}

export const formatTokenBalance = ({
  balance,
  symbol,
  precision,
}: {
  balance: string
  symbol: string
  precision: number
}) => `${formatBalance(balance, precision)} ${symbol}`
