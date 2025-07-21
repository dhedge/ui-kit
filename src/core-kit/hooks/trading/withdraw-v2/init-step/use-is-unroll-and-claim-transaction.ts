import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useInitWithdrawEstimatedReceiveAssets } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-estimated-receive-assets'
import { useIsDhedgeVaultConnected } from 'core-kit/hooks/user'
import { isEqualAddress } from 'core-kit/utils'

export const useIsUnrollAndClaimTransaction = () => {
  const [receiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useInitWithdrawEstimatedReceiveAssets()
  const isDhedgeVaultConnected = useIsDhedgeVaultConnected()

  return (
    assets?.length === 1 &&
    isEqualAddress(assets[0]?.address, receiveToken.address) &&
    !isDhedgeVaultConnected // EasySwapperV2::unrollAndClaim is not supported from within dHEDGE vaults. Managers should be able to use regular initWithdrawal & completeWithdrawal flow instead.
  )
}
