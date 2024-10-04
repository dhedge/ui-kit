import { useReadContract } from 'wagmi'

import { WithdrawalVaultAbi } from 'core-kit/abi/withdrawal-vault'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useWithdrawV2VaultContractAddress } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-v2-vault-contract-address'
import { isZeroAddress } from 'core-kit/utils'

export const useWithdrawV2TrackedAssets = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const withdrawalContractAddress = useWithdrawV2VaultContractAddress()

  return useReadContract({
    address: withdrawalContractAddress,
    abi: WithdrawalVaultAbi,
    functionName: 'getTrackedAssets',
    chainId,
    args: [],
    query: { enabled: !isZeroAddress(withdrawalContractAddress) },
  })
}
