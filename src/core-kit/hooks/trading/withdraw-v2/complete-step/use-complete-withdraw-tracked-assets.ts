import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useEasySwapperTrackedAssets } from 'core-kit/hooks/trading/use-easy-swapper-tracked-assets'
import { useWithdrawAssetsInfo } from 'core-kit/hooks/trading/withdraw-v2/use-withdraw-assets-info'
import { useAccount } from 'core-kit/hooks/web3'

export const useCompleteWithdrawTrackedAssets = () => {
  const { account = AddressZero } = useAccount()
  const { chainId } = useTradingPanelPoolConfig()

  const { data: assets = [] } = useEasySwapperTrackedAssets({
    account,
    chainId,
  })

  return useWithdrawAssetsInfo({ assets, chainId })
}
