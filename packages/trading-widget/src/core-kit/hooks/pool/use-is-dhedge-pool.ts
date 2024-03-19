import { AddressZero } from 'core-kit/const'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import type { Address, ChainId } from 'core-kit/types'

export const useIsDhedgePool = ({
  address = AddressZero,
  chainId,
}: {
  address?: Address
  chainId: ChainId
}) => {
  const { data: { isPool } = {} } = usePoolStatic({ address, chainId })

  return !!isPool
}
