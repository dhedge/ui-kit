import {
  LimitOrderAction,
  LimitOrderState,
  DEFAULT_FORM_DATA,
} from 'limit-orders/providers/state-provider/state-provider.types'

export const reducer = (
  state: LimitOrderState,
  action: LimitOrderAction,
): LimitOrderState => {
  switch (action.type) {
    case 'SET_TAKE_PROFIT_PRICE':
      return {
        ...state,
        form: { ...state.form, takeProfitPrice: action.payload },
        error: null,
      }
    case 'SET_STOP_LOSS_PRICE':
      return {
        ...state,
        form: { ...state.form, stopLossPrice: action.payload },
        error: null,
      }
    case 'SET_IS_MODAL_OPEN':
      return {
        ...state,
        isModalOpen: action.payload,
        error: null,
      }
    case 'SET_TERMS_ACCEPTED':
      return {
        ...state,
        form: { ...state.form, termsAccepted: action.payload },
        error: null,
      }
    case 'SET_PENDING_TRANSACTION':
      return {
        ...state,
        pendingTransaction: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'RESET':
      return {
        ...state,
        form: DEFAULT_FORM_DATA,
        error: null,
        pendingTransaction: null,
      }
    default:
      return state
  }
}
