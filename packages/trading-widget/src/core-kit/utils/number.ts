import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION } from 'core-kit/const'

export const getPercent = (numerator: number, denominator: number) =>
  (numerator / denominator) * 100

export const normalizeNumber = (
  value: string | number | BigNumber,
  precision = DEFAULT_PRECISION,
): number => new BigNumber(value).shiftedBy(-precision).toNumber()

export const getConventionalTokenPriceDecimals = (
  tokenPrice: number,
): number => {
  if (tokenPrice < 1) {
    return 4
  }

  if (tokenPrice < 10) {
    return 3
  }

  return 2
}

export const shiftBy = (
  value: bigint | string | number,
  n = DEFAULT_PRECISION,
): string => new BigNumber(value.toString()).shiftedBy(n).toFixed(0)

export const getPoolFraction = (
  poolTotalValue: string,
  amountToSell: string,
  poolTotalSupply: string,
  precision?: number,
): number =>
  new BigNumber(amountToSell)
    .dividedBy(poolTotalSupply)
    .multipliedBy(poolTotalValue)
    .shiftedBy(-(precision || DEFAULT_PRECISION))
    .toNumber()

export const isBigInt = (value: unknown) => !!value && typeof value === 'bigint'

export const isNumeric = (value: string): boolean =>
  !isNaN(parseFloat(value)) && !isNaN(value as never)
