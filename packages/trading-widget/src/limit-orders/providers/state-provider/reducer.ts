import type {
  LimitOrderAction,
  LimitOrderState,
} from 'limit-orders/providers/state-provider/state-provider.types'

export const DEFAULT_FORM_DATA = {
  upperLimitPrice: '',
  lowerLimitPrice: '',
  termsAccepted: false,
}

export const reducer = (
  state: LimitOrderState,
  action: LimitOrderAction,
): LimitOrderState => {
  switch (action.type) {
    case 'SET_UPPER_LIMIT_PRICE':
      return {
        ...state,
        form: { ...state.form, upperLimitPrice: action.payload },
      }
    case 'SET_LOWER_LIMIT_PRICE':
      return {
        ...state,
        form: { ...state.form, lowerLimitPrice: action.payload },
      }
    case 'SET_IS_MODAL_OPEN':
      return {
        ...state,
        isModalOpen: action.payload,
      }
    case 'SET_TERMS_ACCEPTED':
      return {
        ...state,
        form: { ...state.form, termsAccepted: action.payload },
      }
    case 'RESET':
      return {
        ...state,
        form: DEFAULT_FORM_DATA,
      }
    case 'SET_PENDING_TRANSACTION':
      return {
        ...state,
        pendingTransaction: action.payload,
      }
    default:
      return state
  }
}
