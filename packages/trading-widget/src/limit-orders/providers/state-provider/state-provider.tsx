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
} from './state-provider.types'

function noop() {
  return
}

export const getDefaultLimitOrderState = (
  config: LimitOrderContextConfig['initialState'],
): LimitOrderState => {
  return {
    vaultAddress: config.vaultAddress,
    vaultChainId: config.vaultChainId,
    isModalOpen: false,
    form: DEFAULT_FORM_DATA,
    pendingTransaction: null,
    pricingAsset: config.pricingAsset,
    isReversedOrder: config.isReversedOrder ?? false,
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
  }),
)

export const LimitOrderActionsContext = createContext<LimitOrderActionsState>({
  setIsModalOpen: noop,
  setTakeProfitPrice: noop,
  setStopLossPrice: noop,
  setTermsAccepted: noop,
  reset: noop,
  setPendingTransaction: noop,
})

export const LimitOrderStateProvider: FC<
  PropsWithChildren<LimitOrderContextConfig>
> = ({ children, initialState, actions: callbackActions }) => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultLimitOrderState(initialState),
  )

  const setTakeProfitPrice = useCallback((payload: string) => {
    dispatch({ type: 'SET_TAKE_PROFIT_PRICE', payload })
  }, [])

  const setStopLossPrice = useCallback((payload: string) => {
    dispatch({ type: 'SET_STOP_LOSS_PRICE', payload })
  }, [])

  const setIsModalOpen = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload })
  }, [])

  const setTermsAccepted = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_TERMS_ACCEPTED', payload })
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
      setTakeProfitPrice,
      setIsModalOpen,
      setStopLossPrice,
      setTermsAccepted,
      reset,
      setPendingTransaction,
      onTransactionSuccess: callbackActions?.onTransactionSuccess,
      onTransactionError: callbackActions?.onTransactionError,
    }),
    [
      setTakeProfitPrice,
      setIsModalOpen,
      setStopLossPrice,
      setTermsAccepted,
      reset,
      setPendingTransaction,
      callbackActions?.onTransactionSuccess,
      callbackActions?.onTransactionError,
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
