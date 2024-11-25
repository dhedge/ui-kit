import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useInitWithdrawComplexAssetData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-complex-asset-data'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'
import { useDebounce } from 'core-kit/hooks/utils'

interface UseInitWithdrawTransactionArguments {
  debounceTime?: number
}

export const useInitWithdrawTransactionArguments = ({
  debounceTime,
}: UseInitWithdrawTransactionArguments = {}) => {
  const poolConfig = useTradingPanelPoolConfig()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()

  const withdrawAmountDebounced = useDebounce(
    new BigNumber(sendToken.value || '0')
      .shiftedBy(DEFAULT_PRECISION)
      .toFixed(0, BigNumber.ROUND_DOWN),
    debounceTime ?? 0,
  )

  const { complexAssetData } = useInitWithdrawComplexAssetData()

  return useMemo(() => {
    const withdrawAmount = BigInt(withdrawAmountDebounced)

    if (isMultiAssetsWithdraw) {
      return [withdrawAmount, complexAssetData]
    }

    return [poolConfig.address, withdrawAmount, complexAssetData]
  }, [
    withdrawAmountDebounced,
    isMultiAssetsWithdraw,
    poolConfig.address,
    complexAssetData,
  ])
}
