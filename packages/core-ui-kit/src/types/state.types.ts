import type { EstimationError } from 'models'
import type { PoolConfig, PoolFallbackData } from 'types/config.types'
import type {
  DepositMethodName,
  DynamicTradingToken,
  PendingTransaction,
  TokenSelectorPayload,
  TradingModalStatus,
  TradingPanelType,
  TradingToken,
  TransactionAction,
  UpdateTransactionsArguments,
} from 'types/trading-panel.types'
import type {
  Address,
  ChainId,
  SimulateTransactionParams,
  SimulateTransactionResponse,
} from 'types/web3.types'
import type { WaitForTransactionReceiptReturnType } from 'viem'

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
  entryFee: Record<DepositMethodName, number>
  meta: {
    approvingStatus?: 'pending' | 'success'
  }
  modal: {
    isOpen: boolean
    status: TradingModalStatus
    action?: TransactionAction
    link?: string
    sendToken: TradingToken | null
    receiveToken: TradingToken | null
  }
  poolAddress: PoolConfig['address']
  poolConfigMap: Record<PoolConfig['address'], PoolConfig>
  transactions: PendingTransaction[]
  poolFallbackData: PoolFallbackData
}

export interface TradingPanelSetters {
  setPoolAddress: (payload: TradingPanelState['poolAddress']) => void
  updatePoolConfigDepositMethod: (
    payload: Pick<PoolConfig, 'address'> &
      Pick<PoolConfig['depositParams'], 'method'>,
  ) => void
  updateSendTokenInput: (payload: Partial<DynamicTradingToken>) => void
  updateReceiveTokenInput: (payload: Partial<DynamicTradingToken>) => void
  updateTradingSettings: (
    payload: Partial<TradingPanelState['settings']>,
  ) => void
  setTradingType: (payload: TradingPanelState['type']) => void
  updateTradingMeta: (payload: Partial<TradingPanelState['meta']>) => void
  updateEntryFee: (payload: Partial<TradingPanelState['entryFee']>) => void
  updateTradingModal: (payload: Partial<TradingPanelState['modal']>) => void
  updateTransactions: (payload: UpdateTransactionsArguments) => void
  updatePoolFallbackData: (payload: PoolFallbackData) => void
}

export interface CallbackConfig {
  onSetPoolAddress: TradingPanelSetters['setPoolAddress']
  onUpdatePoolConfigDepositMethod: TradingPanelSetters['updatePoolConfigDepositMethod']
  onUpdateSendTokenInput: TradingPanelSetters['updateSendTokenInput']
  onUpdateReceiveTokenInput: TradingPanelSetters['updateReceiveTokenInput']
  onUpdateTradingSettings: TradingPanelSetters['updateTradingSettings']
  onSetTradingType: TradingPanelSetters['setTradingType']
  onUpdateTradingMeta: TradingPanelSetters['updateTradingMeta']
  onUpdateEntryFee: TradingPanelSetters['updateEntryFee']
  onUpdateTradingModal: TradingPanelSetters['updateTradingModal']
  onUpdateTransactions: TradingPanelSetters['updateTransactions']
  onTransactionError: (
    error: Error,
    action: TransactionAction | undefined,
    chainId?: ChainId,
    txHash?: Address,
  ) => void
  onTransactionSuccess: (
    // data: ReturnType<typeof useWaitForTransaction>,
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
      type: 'UPDATE_POOL_CONFIG_DEPOSIT_METHOD'
      payload: Pick<PoolConfig, 'address'> &
        Pick<PoolConfig['depositParams'], 'method'>
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
      type: 'UPDATE_ENTRY_FEE'
      payload: Partial<TradingPanelState['entryFee']>
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
  actions: Partial<CallbackConfig>
  isDev?: boolean
  initialState?: Partial<TradingPanelState>
}

export type TradingPanelActionsState = TradingPanelSetters & {
  onTransactionError: CallbackConfig['onTransactionError'] | undefined
  onTransactionSuccess: CallbackConfig['onTransactionSuccess'] | undefined
  onTransactionEstimationError:
    | CallbackConfig['onTransactionEstimationError']
    | undefined
  onTokenSelector: CallbackConfig['onTokenSelector'] | undefined
  onLog: CallbackConfig['onLog'] | undefined
  onSimulateTransaction: CallbackConfig['onSimulateTransaction'] | undefined
}
