import type { Address, Hash } from 'viem'

export interface LimitOrderFormData {
  takeProfitPrice: string
  stopLossPrice: string
  termsAccepted: boolean
}

export interface LimitOrderState {
  form: LimitOrderFormData
  isModalOpen: boolean
  vaultAddress: Address
  vaultChainId: number
  isReversedOrder?: boolean
  pricingAsset: {
    address: Address
    symbol: string
  }
  pendingTransaction: Hash | null
  error: string | null
}

export const DEFAULT_FORM_DATA: LimitOrderFormData = {
  takeProfitPrice: '',
  stopLossPrice: '',
  termsAccepted: false,
}

export const DEFAULT_STATE: LimitOrderState = {
  form: DEFAULT_FORM_DATA,
  isModalOpen: false,
  vaultAddress: '0x0000000000000000000000000000000000000000',
  vaultChainId: 0,
  pricingAsset: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: '',
  },
  pendingTransaction: null,
  error: null,
}

export type LimitOrderCallbacks = {
  onTransactionSuccess?: (transaction: Address) => void
  onTransactionError?: (transaction: Address) => void
}

export type LimitOrderActionsState = LimitOrderCallbacks & {
  setIsModalOpen: (payload: boolean) => void
  setTakeProfitPrice: (payload: string) => void
  setStopLossPrice: (payload: string) => void
  setTermsAccepted: (payload: boolean) => void
  setPendingTransaction: (payload: Hash | null) => void
  reset: () => void
}

// Action Types
export type LimitOrderActionType =
  | 'SET_TAKE_PROFIT_PRICE'
  | 'SET_STOP_LOSS_PRICE'
  | 'SET_IS_MODAL_OPEN'
  | 'SET_TERMS_ACCEPTED'
  | 'SET_PENDING_TRANSACTION'
  | 'SET_ERROR'
  | 'RESET'

// Action Interfaces
export interface SetTakeProfitPriceAction {
  type: 'SET_TAKE_PROFIT_PRICE'
  payload: string
}

export interface SetStopLossPriceAction {
  type: 'SET_STOP_LOSS_PRICE'
  payload: string
}

export interface SetIsModalOpenAction {
  type: 'SET_IS_MODAL_OPEN'
  payload: boolean
}

export interface SetTermsAcceptedAction {
  type: 'SET_TERMS_ACCEPTED'
  payload: boolean
}

export interface SetPendingTransactionAction {
  type: 'SET_PENDING_TRANSACTION'
  payload: Hash | null
}

export interface SetErrorAction {
  type: 'SET_ERROR'
  payload: string | null
}

export interface ResetAction {
  type: 'RESET'
}

// Union type for all actions
export type LimitOrderAction =
  | SetTakeProfitPriceAction
  | SetStopLossPriceAction
  | SetIsModalOpenAction
  | SetTermsAcceptedAction
  | SetPendingTransactionAction
  | SetErrorAction
  | ResetAction

// Action Creators
export const createSetTakeProfitPrice = (price: string): SetTakeProfitPriceAction => ({
  type: 'SET_TAKE_PROFIT_PRICE',
  payload: price,
})

export const createSetStopLossPrice = (price: string): SetStopLossPriceAction => ({
  type: 'SET_STOP_LOSS_PRICE',
  payload: price,
})

export const createSetIsModalOpen = (isOpen: boolean): SetIsModalOpenAction => ({
  type: 'SET_IS_MODAL_OPEN',
  payload: isOpen,
})

export const createSetTermsAccepted = (accepted: boolean): SetTermsAcceptedAction => ({
  type: 'SET_TERMS_ACCEPTED',
  payload: accepted,
})

export const createSetPendingTransaction = (transaction: Hash | null): SetPendingTransactionAction => ({
  type: 'SET_PENDING_TRANSACTION',
  payload: transaction,
})

export const createSetError = (error: string | null): SetErrorAction => ({
  type: 'SET_ERROR',
  payload: error,
})

export const createReset = (): ResetAction => ({
  type: 'RESET',
})

export interface LimitOrderContextConfig {
  initialState: Pick<
    LimitOrderState,
    'vaultAddress' | 'vaultChainId' | 'pricingAsset' | 'isReversedOrder'
  >
  actions?: LimitOrderCallbacks
}
