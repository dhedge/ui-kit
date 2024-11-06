import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useDebounce } from 'core-kit/hooks/utils'
import { getSlippageToleranceForWithdrawSafe } from 'core-kit/utils'

interface UseInitWithdrawTransactionArguments {
  debounceTime?: number
}

export const useInitWithdrawTransactionArguments = ({
  debounceTime,
}: UseInitWithdrawTransactionArguments = {}) => {
  const poolConfig = useTradingPanelPoolConfig()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()

  const slippage = useAppliedWithdrawSlippage()

  const withdrawAmountDebounced = useDebounce(
    new BigNumber(sendToken.value || '0')
      .shiftedBy(DEFAULT_PRECISION)
      .toFixed(0, BigNumber.ROUND_DOWN),
    debounceTime ?? 0,
  )

  return useMemo(() => {
    const withdrawAmount = BigInt(withdrawAmountDebounced)
    const slippageTolerance = BigInt(
      getSlippageToleranceForWithdrawSafe(slippage),
    )

    if (isMultiAssetsWithdraw) {
      return [withdrawAmount, slippageTolerance]
    }

    return [poolConfig.address, withdrawAmount, slippageTolerance]
  }, [
    withdrawAmountDebounced,
    slippage,
    isMultiAssetsWithdraw,
    poolConfig.address,
  ])
}
