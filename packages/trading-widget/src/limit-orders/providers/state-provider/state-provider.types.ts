import type { Address, Hash } from 'viem'

import type { UseWriteContractParameters } from 'core-kit/types/web3.types'

export interface LimitOrderState {
  isModalOpen: boolean
  vaultAddress: Address
  vaultChainId: number
  isReversedOrder?: boolean
  minAmountInUsd: number
  form: {
    takeProfitPrice: string
    stopLossPrice: string
    termsAccepted: boolean
  }
  pricingAsset: {
    address: Address
    symbol: string
  }
  pendingTransaction: Hash | null
}

export type OnLimitOrderSettled = NonNullable<
  NonNullable<NonNullable<UseWriteContractParameters>['mutation']>['onSettled']
>

export type LimitOrderCallbacks = {
  onTransactionSuccess?: (transaction: Address) => void
  onTransactionError?: (transaction: Address) => void
  onTransactionSettled?: OnLimitOrderSettled
}

export type LimitOrderActionsState = LimitOrderCallbacks & {
  setIsModalOpen: (payload: boolean) => void
  setTakeProfitPrice: (payload: string) => void
  setStopLossPrice: (payload: string) => void
  setTermsAccepted: (payload: boolean) => void
  setPendingTransaction: (payload: Hash | null) => void
  reset: () => void
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
  | { type: 'RESET' }
  | { type: 'SET_PENDING_TRANSACTION'; payload: Hash | null }

export interface LimitOrderContextConfig {
  initialState: Pick<
    LimitOrderState,
    | 'vaultAddress'
    | 'vaultChainId'
    | 'pricingAsset'
    | 'isReversedOrder'
    | 'minAmountInUsd'
  >
  actions?: LimitOrderCallbacks
}
