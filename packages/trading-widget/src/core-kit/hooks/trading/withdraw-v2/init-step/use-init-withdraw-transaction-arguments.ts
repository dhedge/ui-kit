import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useInitWithdrawComplexAssetData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-complex-asset-data'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useDebounce } from 'core-kit/hooks/utils'
import { getSlippageToleranceForContractTransaction } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface UseInitWithdrawTransactionArguments {
  debounceTime?: number
}

export const useInitWithdrawTransactionArguments = ({
  debounceTime,
}: UseInitWithdrawTransactionArguments = {}) => {
  const poolConfig = useTradingPanelPoolConfig()
  const { aaveOffchainWithdrawChainIds } = useConfigContextParams()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()
  const isOffchainAaveWithdrawSupported = aaveOffchainWithdrawChainIds.includes(
    poolConfig.chainId,
  )

  const slippage = useAppliedWithdrawSlippage()

  const withdrawAmountDebounced = useDebounce(
    new BigNumber(sendToken.value || '0')
      .shiftedBy(DEFAULT_PRECISION)
      .toFixed(0, BigNumber.ROUND_DOWN),
    debounceTime ?? 0,
  )

  const { complexAssetData } = useInitWithdrawComplexAssetData()

  return useMemo(() => {
    const withdrawAmount = BigInt(withdrawAmountDebounced)
    const slippageTolerance = BigInt(
      getSlippageToleranceForContractTransaction(slippage),
    )
    const lastArg = isOffchainAaveWithdrawSupported
      ? complexAssetData
      : slippageTolerance

    if (isMultiAssetsWithdraw) {
      return [withdrawAmount, lastArg]
    }

    return [poolConfig.address, withdrawAmount, lastArg]
  }, [
    withdrawAmountDebounced,
    slippage,
    isOffchainAaveWithdrawSupported,
    complexAssetData,
    isMultiAssetsWithdraw,
    poolConfig.address,
  ])
}
