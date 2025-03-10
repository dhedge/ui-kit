import { encodePacked, keccak256 } from 'viem'

import type { Address } from 'core-kit/types'

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
