import { Balance } from 'types'
import {
  formatToUsd,
  formatUnits,
  normalizeNumber,
} from '@dhedge/core-ui-kit/utils'
import { DEFAULT_PRECISION } from '@dhedge/core-ui-kit/const'

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

export const formatBalance = (
  balance: bigint | undefined,
  tokenPrice: bigint | undefined,
): Omit<Balance, 'includesStakedTokens'> => {
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
