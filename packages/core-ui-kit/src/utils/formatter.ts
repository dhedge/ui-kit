import { getPercent, normalizeNumber } from 'utils/number'

export const formatPercentage = (value: number, maximumFractionDigits = 0) =>
  `${value.toLocaleString('en-US', { maximumFractionDigits })}%`

export const formatToUsd = ({
  value,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  compact = false,
  normalize = false,
}: {
  value: number
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
  }).format(normalize ? normalizeNumber(value) : value)

export const formatNumeratorToPercentage = (
  numerator: number | string,
  denominator: number,
  maximumFractionDigits = 0,
): string => {
  const percent = getPercent(+numerator, denominator)
  return formatPercentage(percent, maximumFractionDigits)
}
