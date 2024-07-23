import type { FC, PropsWithChildren } from 'react'

import { createContext, useCallback, useMemo, useReducer } from 'react'

import {
  AddressZero,
  DEFAULT_PRECISION,
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import type { PoolConfig, PoolFallbackData } from 'core-kit/types/config.types'
import type {
  TradingPanelAction,
  TradingPanelActionsState,
  TradingPanelContextConfig,
  TradingPanelState,
} from 'core-kit/types/state.types'
import type {
  TradingToken,
  UpdateTransactionsArguments,
} from 'core-kit/types/trading-panel.types'

function noop() {
  return
}

const defaultToken: TradingToken = {
  address: AddressZero,
  symbol: '',
  decimals: DEFAULT_PRECISION,
  value: '',
}

export const getDefaultTradingPanelState = (
  config?: Partial<TradingPanelState>,
): TradingPanelState => {
  const poolAddress = config?.poolAddress ?? AddressZero

  const poolToken: TradingToken = {
    address: poolAddress,
    symbol: config?.poolConfigMap?.[poolAddress]?.symbol ?? '',
    decimals: DEFAULT_PRECISION,
    value: '',
  }

  const type = config?.type ?? 'deposit'
  const sendToken = type === 'deposit' ? defaultToken : poolToken
  const receiveToken = type === 'deposit' ? poolToken : defaultToken

  return {
    poolAddress,
    poolConfigMap: {
      ...config?.poolConfigMap,
    },
    settings: {
      slippage: 'auto',
      isInfiniteAllowance: false,
      isMultiAssetWithdrawalEnabled: true,
      isMaxSlippageLoading: false,
      ...config?.settings,
    },
    type,
    input: {
      sendToken: {
        ...sendToken,
        ...config?.input?.sendToken,
      },
      receiveToken: {
        ...receiveToken,
        ...config?.input?.receiveToken,
      },
    },
    meta: {
      ...config?.meta,
    },
    entryFee: {
      deposit: 0,
      depositWithCustomCooldown: 0.1,
      ...config?.entryFee,
    },
    modal: {
      isOpen: false,
      status: 'None',
      receiveToken: null,
      sendToken: null,
      ...config?.modal,
    },
    transactions: config?.transactions ?? [],
    poolFallbackData: { address: AddressZero, ...config?.poolFallbackData },
    defaultChainId: config?.defaultChainId,
  }
}

export const TradingPanelStateContext = createContext<TradingPanelState>({
  ...getDefaultTradingPanelState({
    poolAddress: AddressZero,
    poolConfigMap: {},
  }),
})

export const TradingPanelActionsContext =
  createContext<TradingPanelActionsState>({
    setPoolAddress: noop,
    setTradingType: noop,
    updateSendTokenInput: noop,
    updateReceiveTokenInput: noop,
    updateTradingSettings: noop,
    updateTradingMeta: noop,
    updateEntryFee: noop,
    updateTradingModal: noop,
    updateTransactions: noop,
    updatePoolConfigDepositMethod: noop,
    updatePoolFallbackData: noop,
    onTradingSettleError: noop,
    onTransactionError: noop,
    onTransactionSuccess: noop,
    onTransactionEstimationError: noop,
    onTokenSelector: noop,
    onLog: noop,
    onSimulateTransaction: () => Promise.resolve(null),
  })

const createReducerWithLogger =
  (log: TradingPanelActionsState['onLog']) =>
  (state: TradingPanelState, action: TradingPanelAction): TradingPanelState => {
    switch (action.type) {
      case 'SET_POOL_ADDRESS':
        return {
          ...state,
          poolAddress: action.payload,
        }
      case 'SET_TRADING_TYPE':
        return {
          ...state,
          type: action.payload,
        }
      case 'UPDATE_POOL_CONFIG_DEPOSIT_METHOD':
        return {
          ...state,
          poolConfigMap: {
            ...state.poolConfigMap,
            [action.payload.address]: {
              ...state.poolConfigMap[action.payload.address],
              depositParams: {
                ...state.poolConfigMap[action.payload.address]?.depositParams,
                method: action.payload.method,
              },
            },
          },
        }
      case 'UPDATE_SEND_TOKEN_INPUT':
        return {
          ...state,
          input: {
            ...state.input,
            sendToken: {
              ...state.input.sendToken,
              ...action.payload,
            },
          },
        }
      case 'UPDATE_RECEIVE_TOKEN_INPUT':
        return {
          ...state,
          input: {
            ...state.input,
            receiveToken: {
              ...state.input.receiveToken,
              ...action.payload,
            },
          },
        }
      case 'UPDATE_TRADING_SETTINGS':
        return {
          ...state,
          settings: {
            ...state.settings,
            ...action.payload,
          },
        }
      case 'UPDATE_TRADING_META': {
        return {
          ...state,
          meta: {
            ...state.meta,
            ...action.payload,
          },
        }
      }
      case 'UPDATE_ENTRY_FEE': {
        return {
          ...state,
          entryFee: {
            ...state.entryFee,
            ...action.payload,
          },
        }
      }
      case 'UPDATE_TRADING_MODAL': {
        return {
          ...state,
          modal: {
            ...state.modal,
            ...action.payload,
          },
        }
      }
      case 'UPDATE_POOL_FALLBACK_DATA': {
        return { ...state, poolFallbackData: action.payload }
      }
      case 'UPDATE_TRADING_TRANSACTIONS':
        {
          switch (action.payload.type) {
            case 'remove':
              const transaction = state.transactions.find(
                (tx) => tx.txHash === action.payload.txHash,
              )
              if (action.payload.status === 'success') {
                if (transaction) {
                  if (transaction.action === 'approve') {
                    log?.(TRADING_PANEL_LOG_EVENT.APPROVED_TOKEN, {
                      [TRADING_LOG_EVENT_PARAM.SYMBOL.NAME]: transaction.symbol,
                    })
                  } else {
                    const eventName =
                      transaction.action === 'deposit'
                        ? TRADING_PANEL_LOG_EVENT.DEPOSIT
                        : TRADING_PANEL_LOG_EVENT.WITHDRAWAL
                    log?.(eventName, {
                      [TRADING_LOG_EVENT_PARAM.SYMBOL.NAME]: transaction.symbol,
                      [TRADING_LOG_EVENT_PARAM.CHAIN_ID.NAME]:
                        transaction.chainId,
                      [TRADING_LOG_EVENT_PARAM.ADDRESS.NAME]: state.poolAddress,
                    })
                  }
                }
              }

              return {
                ...state,
                transactions: action.payload.txHash
                  ? state.transactions.filter(
                      (tx) => tx.txHash !== action.payload.txHash,
                    )
                  : state.transactions.slice(0, -1),
              }
            case 'add':
              return {
                ...state,
                transactions: [
                  {
                    action: action.payload.action,
                    chainId: action.payload.chainId,
                    txHash: action.payload.txHash,
                    symbol: action.payload.symbol,
                  },
                  ...state.transactions,
                ],
              }
            case 'update':
              const txIndex = Math.max(
                state.transactions.findIndex(
                  ({ txHash }) => txHash === action.payload.txHash,
                ),
                0,
              )
              return {
                ...state,
                transactions: state.transactions.map((tx, i) => {
                  if (i === txIndex) {
                    return { ...tx, ...action.payload }
                  }
                  return tx
                }),
              }
          }
        }
        break

      //TODO: add reset state handler (e.g. on pool change)

      default:
        return state
    }
  }

export const TradingPanelProvider: FC<
  PropsWithChildren<TradingPanelContextConfig>
> = ({
  children,
  initialState,
  actions: {
    onSetPoolAddress,
    onUpdatePoolConfigDepositMethod,
    onUpdateSendTokenInput,
    onUpdateReceiveTokenInput,
    onUpdateTradingSettings,
    onSetTradingType,
    onUpdateTradingMeta,
    onUpdateTradingModal,
    onUpdateTransactions,
    onUpdateEntryFee,
    onTransactionError,
    onTransactionSuccess,
    onTransactionEstimationError,
    onTokenSelector,
    onLog,
    onSimulateTransaction,
    onTradingSettleError,
  },
}) => {
  const [state, dispatch] = useReducer(
    createReducerWithLogger(onLog),
    getDefaultTradingPanelState(initialState),
  )

  const setPoolAddress = useCallback(
    (payload: TradingPanelState['poolAddress']) => {
      dispatch({ type: 'SET_POOL_ADDRESS', payload })
      onSetPoolAddress?.(payload)
    },
    [onSetPoolAddress],
  )

  const updateSendTokenInput = useCallback(
    (payload: Partial<TradingToken>) => {
      dispatch({ type: 'UPDATE_SEND_TOKEN_INPUT', payload })
      onUpdateSendTokenInput?.(payload)
    },
    [onUpdateSendTokenInput],
  )

  const updateReceiveTokenInput = useCallback(
    (payload: Partial<TradingToken>) => {
      dispatch({ type: 'UPDATE_RECEIVE_TOKEN_INPUT', payload })
      onUpdateReceiveTokenInput?.(payload)
    },
    [onUpdateReceiveTokenInput],
  )

  const updateTradingSettings = useCallback(
    (payload: Partial<TradingPanelState['settings']>) => {
      dispatch({ type: 'UPDATE_TRADING_SETTINGS', payload })
      onUpdateTradingSettings?.(payload)
    },
    [onUpdateTradingSettings],
  )

  const setTradingType = useCallback(
    (payload: TradingPanelState['type']) => {
      dispatch({ type: 'SET_TRADING_TYPE', payload })
      onSetTradingType?.(payload)
    },
    [onSetTradingType],
  )

  const updateTradingMeta = useCallback(
    (payload: Partial<TradingPanelState['meta']>) => {
      dispatch({ type: 'UPDATE_TRADING_META', payload })
      onUpdateTradingMeta?.(payload)
    },
    [onUpdateTradingMeta],
  )

  const updateEntryFee = useCallback(
    (payload: Partial<TradingPanelState['entryFee']>) => {
      dispatch({ type: 'UPDATE_ENTRY_FEE', payload })
      onUpdateEntryFee?.(payload)
    },
    [onUpdateEntryFee],
  )

  const updateTradingModal = useCallback(
    (payload: Partial<TradingPanelState['modal']>) => {
      dispatch({ type: 'UPDATE_TRADING_MODAL', payload })
      onUpdateTradingModal?.(payload)
    },
    [onUpdateTradingModal],
  )

  const updateTransactions = useCallback(
    (payload: UpdateTransactionsArguments) => {
      dispatch({ type: 'UPDATE_TRADING_TRANSACTIONS', payload })
      onUpdateTransactions?.(payload)
    },
    [onUpdateTransactions],
  )

  const updatePoolConfigDepositMethod = useCallback(
    (
      payload: Pick<PoolConfig, 'address'> &
        Pick<PoolConfig['depositParams'], 'method'>,
    ) => {
      dispatch({ type: 'UPDATE_POOL_CONFIG_DEPOSIT_METHOD', payload })
      onUpdatePoolConfigDepositMethod?.(payload)
    },
    [onUpdatePoolConfigDepositMethod],
  )

  const updatePoolFallbackData = useCallback((payload: PoolFallbackData) => {
    dispatch({ type: 'UPDATE_POOL_FALLBACK_DATA', payload })
  }, [])

  const actions: TradingPanelActionsState = useMemo(
    () => ({
      setPoolAddress,
      setTradingType,
      updatePoolConfigDepositMethod,
      updateTradingSettings,
      updateSendTokenInput,
      updateReceiveTokenInput,
      updateTradingMeta,
      updateTradingModal,
      updateTransactions,
      updateEntryFee,
      updatePoolFallbackData,
      onTransactionError,
      onTransactionSuccess,
      onTransactionEstimationError,
      onTokenSelector,
      onLog,
      onSimulateTransaction,
      onTradingSettleError,
    }),
    [
      setPoolAddress,
      setTradingType,
      updatePoolConfigDepositMethod,
      updateTradingSettings,
      updateSendTokenInput,
      updateReceiveTokenInput,
      updateTradingMeta,
      updateTradingModal,
      updateTransactions,
      updateEntryFee,
      updatePoolFallbackData,
      onTransactionError,
      onTransactionSuccess,
      onTransactionEstimationError,
      onTokenSelector,
      onLog,
      onSimulateTransaction,
      onTradingSettleError,
    ],
  )

  return (
    <TradingPanelActionsContext.Provider value={actions}>
      <TradingPanelStateContext.Provider value={state}>
        {children}
      </TradingPanelStateContext.Provider>
    </TradingPanelActionsContext.Provider>
  )
}
