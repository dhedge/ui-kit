import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useInitWithdrawEstimatedReceiveAssets } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-estimated-receive-assets'
import { isEqualAddress } from 'core-kit/utils'

export const useIsUnrollAndClaimTransaction = () => {
  const [receiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useInitWithdrawEstimatedReceiveAssets()

  return (
    assets?.length === 1 &&
    isEqualAddress(assets[0]?.address, receiveToken.address)
  )
}
