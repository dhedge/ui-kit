import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useLimitOrderWithdrawAmount } from 'core-kit/hooks/trading/limit-order-withdraw/use-limit-order-withdraw-amount'
import { useAccount, useTokenAllowance } from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'

export const useIsLimitWithdrawOrderApproved = () => {
  const { account = AddressZero } = useAccount()
  const { address: vaultAddress, chainId } = useTradingPanelPoolConfig()
  const limitOrderAddress = getContractAddressById('limitOrder', chainId)
  const vaultAmount = useLimitOrderWithdrawAmount()

  const { data: allowance } = useTokenAllowance({
    tokenAddress: vaultAddress,
    ownerAddress: account,
    spenderAddress: limitOrderAddress,
    chainId,
  })

  return allowance ? vaultAmount.lte(allowance.toString()) : false
}
