import BigNumber from 'bignumber.js'

import { CURRENCY_SYMBOL_MAP } from 'core-kit/const'

import type { ApyCurrency } from 'core-kit/types'

import { getPercent, isNumeric, normalizeNumber } from './number'

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
    4,
  )}`
}

export const formatBalance = (value: string, precision: number) =>
  new BigNumber(
    new BigNumber(value).toFixed(precision, BigNumber.ROUND_DOWN),
  ).toString()
