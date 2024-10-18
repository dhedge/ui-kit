import { AddressZero } from 'core-kit/const'
import { useUserMulticall } from 'core-kit/hooks/user/multicall/use-user-multicall'
import type { Address, ChainId } from 'core-kit/types'

export const useIsDhedgePool = ({
  address = AddressZero,
  chainId,
}: {
  address?: Address
  chainId: ChainId
}) => {
  const { data: { isUserDhedgePool } = {} } = useUserMulticall({
    address,
    chainId,
  })

  return !!isUserDhedgePool
}
