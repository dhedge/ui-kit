import BigNumber from 'bignumber.js'
import { encodePacked, keccak256 } from 'viem'

import type { Address } from 'core-kit/types'
import { formatPercentage } from 'core-kit/utils'

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
    ? `+${formatPercentage((1 - +price / +markPrice) * 100, 2)}`
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
