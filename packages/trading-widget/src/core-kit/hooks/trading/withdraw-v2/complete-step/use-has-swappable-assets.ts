import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-tracked-assets'
import { isEqualAddress } from 'core-kit/utils'

export const useHasSwappableAssets = () => {
  const [receiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  return (
    assets.length > 0 &&
    assets.some(({ address }) => !isEqualAddress(address, receiveToken.address))
  )
}
