import { useSendTokenInput } from 'core-kit/hooks/state'
import type { useInitWithdrawEstimatedReceiveAssets } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { useIsUnrollAndClaimTransaction } from 'core-kit/hooks/trading/withdraw-v2/init-step'

export interface SingleAssetCompositionTableProps {
  assets: ReturnType<typeof useInitWithdrawEstimatedReceiveAssets>['data']
  isLoading: boolean
}

export const useSingleAssetCompositionTable = ({
  assets,
}: Pick<SingleAssetCompositionTableProps, 'assets'>) => {
  const [sendToken] = useSendTokenInput()
  const showSingleTokenAmount = useIsUnrollAndClaimTransaction()

  return {
    showReceivedResults: !!sendToken.value && sendToken.value !== '0',
    showSingleTokenAmount,
    singleTokenBalance: assets?.[0]?.balance,
  }
}
