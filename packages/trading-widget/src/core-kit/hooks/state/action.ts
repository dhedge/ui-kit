import { useTradingPanelActions } from './context'

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

export const useGetSwapData = () => useTradingPanelActions().getSwapData

export const useUpdatePoolConfig = () =>
  useTradingPanelActions().updatePoolConfig
