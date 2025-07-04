import BigNumber from 'bignumber.js'

import { AddressZero } from 'core-kit/const'
import { useAccount, useTokenAllowance } from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'
import { useLimitOrderState } from 'limit-orders/hooks/state'
import { useLimitOrderCoveredVaultAmount } from 'limit-orders/hooks/use-limit-order-covered-vault-amount'

export const useIsLimitOrderApproved = () => {
  const { account = AddressZero } = useAccount()
  const { vaultAddress, vaultChainId } = useLimitOrderState()
  const limitOrderAddress = getContractAddressById('limitOrder', vaultChainId)

  const vaultAmount = useLimitOrderCoveredVaultAmount()

  const { data: allowance } = useTokenAllowance({
    tokenAddress: vaultAddress,
    ownerAddress: account,
    spenderAddress: limitOrderAddress,
    chainId: vaultChainId,
  })

  return allowance
    ? new BigNumber(vaultAmount.raw).lte(allowance.toString())
    : false
}
