import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo, useReducer } from 'react'

import { AddressZero } from 'core-kit/const'

import { PRICING_ASSET_MAP } from 'limit-orders/constants'

import type {
  LimitOrderAction,
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
    takeProfitPrice: '',
    stopLossPrice: '',
    termsAccepted: false,
    pricingAssetsMap: Object.fromEntries(
      Object.entries({ ...PRICING_ASSET_MAP, ...config.pricingAssetsMap }).map(
        ([k, v]) => [k.toLowerCase(), v],
      ),
    ),
  }
}

export const LimitOrderStateContext = createContext<LimitOrderState>(
  getDefaultLimitOrderState({ vaultAddress: AddressZero, vaultChainId: 0 }),
)

export const LimitOrderActionsContext = createContext<LimitOrderActionsState>({
  setIsModalOpen: noop,
  setTakeProfitPrice: noop,
  setStopLossPrice: noop,
  setTermsAccepted: noop,
})

const reducer = (
  state: LimitOrderState,
  action: LimitOrderAction,
): LimitOrderState => {
  switch (action.type) {
    case 'SET_TAKE_PROFIT_PRICE':
      return {
        ...state,
        takeProfitPrice: action.payload,
      }
    case 'SET_STOP_LOSS_PRICE':
      return {
        ...state,
        stopLossPrice: action.payload,
      }
    case 'SET_IS_MODAL_OPEN':
      return {
        ...state,
        isModalOpen: action.payload,
      }
    case 'SET_TERMS_ACCEPTED':
      return {
        ...state,
        termsAccepted: action.payload,
      }
    default:
      return state
  }
}

export const LimitOrderStateProvider: FC<
  PropsWithChildren<LimitOrderContextConfig>
> = ({ children, initialState }) => {
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

  const actions: LimitOrderActionsState = useMemo(
    () => ({
      setTakeProfitPrice,
      setIsModalOpen,
      setStopLossPrice,
      setTermsAccepted,
    }),
    [setTakeProfitPrice, setIsModalOpen, setStopLossPrice, setTermsAccepted],
  )

  return (
    <LimitOrderActionsContext.Provider value={actions}>
      <LimitOrderStateContext.Provider value={state}>
        {children}
      </LimitOrderStateContext.Provider>
    </LimitOrderActionsContext.Provider>
  )
}
