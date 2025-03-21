import BigNumber from 'bignumber.js'

import { AddressZero } from 'core-kit/const'
import { useAccount, useBalance, useTokenAllowance } from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'
import { useLimitOrderState } from 'limit-orders/hooks/state'

export const useIsLimitOrderApproved = () => {
  const { account = AddressZero } = useAccount()
  const { vaultAddress, vaultChainId } = useLimitOrderState()
  const limitOrderAddress = getContractAddressById('limitOrder', vaultChainId)

  const { data: allowance } = useTokenAllowance({
    tokenAddress: vaultAddress,
    ownerAddress: account,
    spenderAddress: limitOrderAddress,
    chainId: vaultChainId,
  })

  const { data: vaultBalance } = useBalance({
    address: account,
    token: vaultAddress,
    chainId: vaultChainId,
  })

  return allowance && vaultBalance
    ? new BigNumber(vaultBalance.value.toString()).lte(allowance.toString())
    : false
}
