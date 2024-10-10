import type { EstimationError } from 'core-kit/models'

import type { PoolConfig, PoolFallbackData } from 'core-kit/types/config.types'
import type {
  DynamicTradingToken,
  PendingTransaction,
  TokenSelectorPayload,
  TradingModalStatus,
  TradingPanelType,
  TradingToken,
  TransactionAction,
  UpdateTransactionsArguments,
} from 'core-kit/types/trading-panel.types'
import type {
  SwapDataRequest,
  SwapDataResponse,
} from 'core-kit/types/trading.types'
import type {
  Address,
  ChainId,
  SimulateTransactionParams,
  SimulateTransactionResponse,
  WaitForTransactionReceiptReturnType,
} from 'core-kit/types/web3.types'

export interface TradingPanelStateModal {
  isOpen: boolean
  status: TradingModalStatus
  action?: TransactionAction
  link?: string
  sendTokens: TradingToken[] | null
  receiveToken: TradingToken | null
}

export interface TradingPanelState {
  settings: {
    slippage: number | 'auto'
    minSlippage?: number
    isInfiniteAllowance: boolean
    isMultiAssetWithdrawalEnabled: boolean
    isMaxSlippageLoading: boolean
  }
  type: TradingPanelType
  input: {
    sendToken: DynamicTradingToken
    receiveToken: DynamicTradingToken
  }
  meta: {
    approvingStatus?: 'pending' | 'success'
  }
  modal: TradingPanelStateModal
  poolAddress: PoolConfig['address']
  poolConfigMap: Record<PoolConfig['address'], PoolConfig>
  transactions: PendingTransaction[]
  poolFallbackData: PoolFallbackData
  defaultChainId?: ChainId
}

export interface TradingPanelSetters {
  setPoolAddress: (payload: TradingPanelState['poolAddress']) => void
  updateSendTokenInput: (payload: Partial<DynamicTradingToken>) => void
  updateReceiveTokenInput: (payload: Partial<DynamicTradingToken>) => void
  updateTradingSettings: (
    payload: Partial<TradingPanelState['settings']>,
  ) => void
  setTradingType: (payload: TradingPanelState['type']) => void
  updateTradingMeta: (payload: Partial<TradingPanelState['meta']>) => void
  updateTradingModal: (payload: Partial<TradingPanelState['modal']>) => void
  updateTransactions: (payload: UpdateTransactionsArguments) => void
  updatePoolFallbackData: (payload: PoolFallbackData) => void
}

export interface CallbackConfig {
  onSetPoolAddress: TradingPanelSetters['setPoolAddress']
  onUpdateSendTokenInput: TradingPanelSetters['updateSendTokenInput']
  onUpdateReceiveTokenInput: TradingPanelSetters['updateReceiveTokenInput']
  onUpdateTradingSettings: TradingPanelSetters['updateTradingSettings']
  onSetTradingType: TradingPanelSetters['setTradingType']
  onUpdateTradingMeta: TradingPanelSetters['updateTradingMeta']
  onUpdateTradingModal: TradingPanelSetters['updateTradingModal']
  onUpdateTransactions: TradingPanelSetters['updateTransactions']
  onTradingSettleError: (error: Error) => void
  onTransactionError: (
    error: Error,
    action: TransactionAction | undefined,
    chainId?: ChainId,
    txHash?: Address,
  ) => void
  onTransactionSuccess: (
    data: WaitForTransactionReceiptReturnType,
    action: TransactionAction | undefined,
    link?: string,
  ) => void
  onTransactionEstimationError: (
    error: EstimationError,
    address: Address,
    chainId: ChainId,
    account?: Address,
  ) => void
  onTokenSelector: (payload: TokenSelectorPayload) => void
  onLog: (eventName: string, payload?: Record<string, unknown>) => void
  onSimulateTransaction: (
    params: SimulateTransactionParams,
  ) => Promise<SimulateTransactionResponse | null>
  getSwapData: (args: {
    signal: AbortSignal
    variables: SwapDataRequest
  }) => Promise<SwapDataResponse | null>
}

export type TradingPanelAction =
  | {
      type: 'SET_POOL_ADDRESS'
      payload: TradingPanelState['poolAddress']
    }
  | {
      type: 'SET_TRADING_TYPE'
      payload: TradingPanelState['type']
    }
  | {
      type: 'UPDATE_SEND_TOKEN_INPUT'
      payload: Partial<DynamicTradingToken>
    }
  | {
      type: 'UPDATE_RECEIVE_TOKEN_INPUT'
      payload: Partial<DynamicTradingToken>
    }
  | {
      type: 'UPDATE_TRADING_SETTINGS'
      payload: Partial<TradingPanelState['settings']>
    }
  | {
      type: 'UPDATE_TRADING_META'
      payload: Partial<TradingPanelState['meta']>
    }
  | {
      type: 'UPDATE_TRADING_MODAL'
      payload: Partial<TradingPanelState['modal']>
    }
  | {
      type: 'UPDATE_TRADING_TRANSACTIONS'
      payload: UpdateTransactionsArguments
    }
  | { type: 'UPDATE_POOL_FALLBACK_DATA'; payload: PoolFallbackData }

export interface TradingPanelContextConfig {
  actions: Partial<CallbackConfig> & Pick<CallbackConfig, 'getSwapData'>
  initialState?: Partial<TradingPanelState>
}

export type TradingPanelActionsState = TradingPanelSetters & {
  onTradingSettleError: CallbackConfig['onTradingSettleError'] | undefined
  onTransactionError: CallbackConfig['onTransactionError'] | undefined
  onTransactionSuccess: CallbackConfig['onTransactionSuccess'] | undefined
  onTransactionEstimationError:
    | CallbackConfig['onTransactionEstimationError']
    | undefined
  onTokenSelector: CallbackConfig['onTokenSelector'] | undefined
  onLog: CallbackConfig['onLog'] | undefined
  onSimulateTransaction: CallbackConfig['onSimulateTransaction'] | undefined
  getSwapData: CallbackConfig['getSwapData']
}
