import { useCallback } from 'react'

import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type { SwapDataRequest } from 'core-kit/types'

export const useSetPoolAddress = () => useTradingPanelActions().setPoolAddress

export const useUpdateSendTokenInput = () =>
  useTradingPanelActions().updateSendTokenInput

export const useUpdateReceiveTokenInput = () =>
  useTradingPanelActions().updateReceiveTokenInput

export const useUpdateTradingSettings = () =>
  useTradingPanelActions().updateTradingSettings

export const useSetTradingType = () => useTradingPanelActions().setTradingType

export const useUpdateTradingModal = () =>
  useTradingPanelActions().updateTradingModal

export const useUpdatePoolFallbackData = () =>
  useTradingPanelActions().updatePoolFallbackData

export const useOnTransactionError = () =>
  useTradingPanelActions().onTransactionError

export const useOnTradingSettleError = () =>
  useTradingPanelActions().onTradingSettleError

export const useOnTransactionSuccess = () =>
  useTradingPanelActions().onTransactionSuccess

export const useOnTransactionEstimationError = () =>
  useTradingPanelActions().onTransactionEstimationError

export const useOnTokenSelector = () => useTradingPanelActions().onTokenSelector

export const useTradingPanelLogger = () => useTradingPanelActions().onLog

export const useOnSimulateTransaction = () =>
  useTradingPanelActions().onSimulateTransaction

export const useGetSwapData = () => {
  const getSwapData = useTradingPanelActions().getSwapData
  const {
    settings: { selectedAggregators },
  } = useTradingPanelState()

  return useCallback(
    ({
      signal,
      variables,
    }: {
      signal: AbortSignal
      variables: SwapDataRequest
    }) =>
      getSwapData({
        signal,
        variables: {
          ...variables,
          ...(!!selectedAggregators.length && {
            aggregators: selectedAggregators,
          }),
        },
      }),
    [getSwapData, selectedAggregators],
  )
}

export const useUpdatePoolConfig = () =>
  useTradingPanelActions().updatePoolConfig

export const useAddPoolConfig = () => useTradingPanelActions().addPoolConfig

export const useUpdateCustomDepositTokensPerChain = () =>
  useTradingPanelActions().updateCustomDepositTokensPerChain
