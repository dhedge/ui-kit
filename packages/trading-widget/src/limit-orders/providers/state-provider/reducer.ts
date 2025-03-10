import type {
  LimitOrderAction,
  LimitOrderState,
} from 'limit-orders/providers/state-provider/state-provider.types'

export const DEFAULT_FORM_DATA = {
  takeProfitPrice: '',
  stopLossPrice: '',
  termsAccepted: false,
}

export const reducer = (
  state: LimitOrderState,
  action: LimitOrderAction,
): LimitOrderState => {
  switch (action.type) {
    case 'SET_TAKE_PROFIT_PRICE':
      return {
        ...state,
        form: { ...state.form, takeProfitPrice: action.payload },
      }
    case 'SET_STOP_LOSS_PRICE':
      return {
        ...state,
        form: { ...state.form, stopLossPrice: action.payload },
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
