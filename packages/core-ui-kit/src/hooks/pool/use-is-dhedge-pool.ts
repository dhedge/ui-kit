import { AddressZero } from 'const'
import { usePoolStatic } from 'hooks/pool/multicall'
import type { Address, ChainId } from 'types'

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
