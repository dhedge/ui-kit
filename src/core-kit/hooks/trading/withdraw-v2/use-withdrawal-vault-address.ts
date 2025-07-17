import { useReadContract } from 'wagmi'

import { EasySwapperV2Abi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useAccount } from 'core-kit/hooks/web3'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'

export const useWithdrawalVaultAddress = () => {
  const { account = AddressZero } = useAccount()

  const { chainId } = useTradingPanelPoolConfig()

  return useReadContract({
    address: getContractAddressById('easySwapperV2', chainId),
    abi: EasySwapperV2Abi,
    functionName: 'withdrawalContracts',
    chainId,
    args: [account],
    query: { enabled: !isZeroAddress(account) },
  })
}
