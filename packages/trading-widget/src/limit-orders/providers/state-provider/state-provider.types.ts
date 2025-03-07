import type { Address } from 'viem'

export interface LimitOrderState {
  isModalOpen: boolean
  vaultAddress: Address
  vaultChainId: number
  takeProfitPrice: string
  stopLossPrice: string
  termsAccepted: boolean
  pricingAssetsMap: Record<Address, Address>
}

export type LimitOrderActionsState = {
  setIsModalOpen: (payload: boolean) => void
  setTakeProfitPrice: (payload: string) => void
  setStopLossPrice: (payload: string) => void
  setTermsAccepted: (payload: boolean) => void
}

export type LimitOrderAction =
  | {
      type: 'SET_TAKE_PROFIT_PRICE'
      payload: string
    }
  | {
      type: 'SET_STOP_LOSS_PRICE'
      payload: string
    }
  | { type: 'SET_IS_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_TERMS_ACCEPTED'; payload: boolean }

export interface LimitOrderContextConfig {
  initialState: Pick<LimitOrderState, 'vaultAddress' | 'vaultChainId'> &
    Partial<Pick<LimitOrderState, 'pricingAssetsMap'>>
}
