import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo, useReducer } from 'react'

import { AddressZero } from 'core-kit/const'

import { DEFAULT_MIN_ORDER_AMOUNT } from 'limit-orders/constants'
import {
  DEFAULT_FORM_DATA,
  reducer,
} from 'limit-orders/providers/state-provider/reducer'

import type {
  LimitOrderActionsState,
  LimitOrderContextConfig,
  LimitOrderState,
} from 'limit-orders/providers/state-provider/state-provider.types'

function noop() {
  return
}

export const getDefaultLimitOrderState = (
  config: LimitOrderContextConfig['initialState'],
): LimitOrderState => {
  return {
    vaultAddress: config.vaultAddress,
    vaultChainId: config.vaultChainId,
    isModalOpen: config.isModalOpen ?? false,
    form: {
      ...DEFAULT_FORM_DATA,
      ...config.form,
    },
    pendingTransaction: null,
    pricingAsset: config.pricingAsset,
    minAmountInUsd: config.minAmountInUsd,
  }
}

export const LimitOrderStateContext = createContext<LimitOrderState>(
  getDefaultLimitOrderState({
    vaultAddress: AddressZero,
    vaultChainId: 0,
    pricingAsset: {
      address: AddressZero,
      symbol: '',
    },
    minAmountInUsd: DEFAULT_MIN_ORDER_AMOUNT,
    form: {
      lowerLimitPrice: '',
      upperLimitPrice: '',
    },
  }),
)

export const LimitOrderActionsContext = createContext<LimitOrderActionsState>({
  setIsModalOpen: noop,
  setUpperLimitPrice: noop,
  setLowerLimitPrice: noop,
  setTermsAccepted: noop,
  setSellPercentage: noop,
  reset: noop,
  setPendingTransaction: noop,
  onLog: noop,
})

export const LimitOrderStateProvider: FC<
  PropsWithChildren<LimitOrderContextConfig>
> = ({ children, initialState, actions: callbackActions }) => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultLimitOrderState(initialState),
  )

  const setUpperLimitPrice = useCallback((payload: string) => {
    dispatch({ type: 'SET_UPPER_LIMIT_PRICE', payload })
  }, [])

  const setLowerLimitPrice = useCallback((payload: string) => {
    dispatch({ type: 'SET_LOWER_LIMIT_PRICE', payload })
  }, [])

  const setIsModalOpen = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload })
  }, [])

  const setTermsAccepted = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_TERMS_ACCEPTED', payload })
  }, [])

  const setSellPercentage = useCallback((payload: string) => {
    dispatch({ type: 'SET_SELL_PERCENTAGE', payload })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const setPendingTransaction = useCallback(
    (payload: LimitOrderState['pendingTransaction']) => {
      dispatch({ type: 'SET_PENDING_TRANSACTION', payload })
    },
    [],
  )

  const actions: LimitOrderActionsState = useMemo(
    () => ({
      setUpperLimitPrice,
      setIsModalOpen,
      setLowerLimitPrice,
      setTermsAccepted,
      setSellPercentage,
      reset,
      setPendingTransaction,
      onTransactionSuccess: callbackActions?.onTransactionSuccess,
      onTransactionError: callbackActions?.onTransactionError,
      onTransactionSettled: callbackActions?.onTransactionSettled,
      onLog: callbackActions?.onLog,
    }),
    [
      setUpperLimitPrice,
      setIsModalOpen,
      setLowerLimitPrice,
      setTermsAccepted,
      setSellPercentage,
      reset,
      setPendingTransaction,
      callbackActions?.onTransactionSuccess,
      callbackActions?.onTransactionError,
      callbackActions?.onTransactionSettled,
      callbackActions?.onLog,
    ],
  )

  return (
    <LimitOrderActionsContext.Provider value={actions}>
      <LimitOrderStateContext.Provider value={state}>
        {children}
      </LimitOrderStateContext.Provider>
    </LimitOrderActionsContext.Provider>
  )
}
