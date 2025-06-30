import BigNumber from 'bignumber.js'
import { encodePacked, keccak256 } from 'viem'

import { INVALID_PRICES_LIMIT_ORDER_TITLE } from 'core-kit/const'
import type { Address } from 'core-kit/types'
import { formatPercentage } from 'core-kit/utils'
import type { TranslationMap } from 'limit-orders/providers/translation-provider'

export const getLimitOrderId = ({
  userAddress,
  vaultAddress,
}: {
  userAddress: Address
  vaultAddress: Address
}) => {
  const encoded = encodePacked(
    ['address', 'address'],
    [userAddress, vaultAddress],
  )
  return keccak256(encoded)
}

export const calculateProfitPriceDifference = ({
  price,
  markPrice,
}: {
  price: string
  markPrice: string
}) =>
  new BigNumber(price).gt(markPrice)
    ? `+${formatPercentage((+price / +markPrice - 1) * 100, 2)}`
    : ''

export const calculateLossPriceDifference = ({
  price,
  markPrice,
}: {
  price: string
  markPrice: string
}) =>
  new BigNumber(price).lt(markPrice)
    ? `-${formatPercentage((1 - +price / +markPrice) * 100, 2)}`
    : ''

export const adjustLimitOrderError = ({
  error,
  translationMap,
}: {
  error: { title: string; hint?: string } | null
  translationMap: Required<Partial<TranslationMap>>
}) => {
  if (!error) {
    return null
  }

  if (error.title === INVALID_PRICES_LIMIT_ORDER_TITLE) {
    return {
      ...error,
      hint: translationMap.invalidLimitOrderPriceError,
    }
  }
  return error
}
