import { EasySwapperV2Abi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useWithdrawAssetsInfo } from 'core-kit/hooks/trading/withdraw-v2/use-withdraw-assets-info'
import { useAccount, useReadContract } from 'core-kit/hooks/web3'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'

export const useCompleteWithdrawTrackedAssets = () => {
  const { account = AddressZero } = useAccount()
  const { chainId } = useTradingPanelPoolConfig()

  const { data: assets = [] } = useReadContract({
    address: getContractAddressById('easySwapperV2', chainId),
    abi: EasySwapperV2Abi,
    functionName: 'getTrackedAssets',
    chainId,
    args: [account],
    query: { enabled: !isZeroAddress(account) },
  })

  return useWithdrawAssetsInfo({ assets, chainId })
}
