import type { Address, Hash } from 'viem'

import type { UseWriteContractParameters } from 'core-kit/types/web3.types'

export type PendingTransaction = {
  hash: Hash
  action: 'approve' | 'create' | 'remove'
}

export interface LimitOrderState {
  isModalOpen: boolean
  vaultAddress: Address
  vaultChainId: number
  minAmountInUsd: number
  form: {
    upperLimitPrice: string
    lowerLimitPrice: string
    termsAccepted: boolean
    sellPercentage: string
  }
  pricingAsset: {
    address: Address
    symbol: string
  }
  pendingTransaction: PendingTransaction | null
}

export type OnLimitOrderSettled = NonNullable<
  NonNullable<NonNullable<UseWriteContractParameters>['mutation']>['onSettled']
>

export type LimitOrderCallbacks = {
  onTransactionSuccess?: (transaction: Address) => void
  onTransactionError?: (transaction: Address) => void
  onTransactionSettled?: OnLimitOrderSettled
  onLog?: (eventName: string, payload?: Record<string, unknown>) => void
}

export type LimitOrderActionsState = LimitOrderCallbacks & {
  setIsModalOpen: (payload: boolean) => void
  setUpperLimitPrice: (payload: string) => void
  setLowerLimitPrice: (payload: string) => void
  setTermsAccepted: (payload: boolean) => void
  setSellPercentage: (payload: string) => void
  setPendingTransaction: (payload: PendingTransaction | null) => void
  reset: () => void
}

export type LimitOrderAction =
  | {
      type: 'SET_UPPER_LIMIT_PRICE'
      payload: string
    }
  | {
      type: 'SET_LOWER_LIMIT_PRICE'
      payload: string
    }
  | { type: 'SET_IS_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_TERMS_ACCEPTED'; payload: boolean }
  | { type: 'SET_SELL_PERCENTAGE'; payload: string }
  | { type: 'RESET' }
  | { type: 'SET_PENDING_TRANSACTION'; payload: PendingTransaction | null }

export interface LimitOrderContextConfig {
  initialState: Pick<
    LimitOrderState,
    'vaultAddress' | 'vaultChainId' | 'pricingAsset' | 'minAmountInUsd'
  > &
    Partial<Pick<LimitOrderState, 'isModalOpen'>>
  actions?: LimitOrderCallbacks
}
