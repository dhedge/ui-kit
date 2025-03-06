import type { Address } from 'viem'

export interface LimitOrderState {
  isModalOpen: boolean
  vaultAddress: Address
  vaultChainId: number
}

export type LimitOrderActionsState = {
  setVaultAddress: (payload: LimitOrderState['vaultAddress']) => void
  setIsModalOpen: (payload: boolean) => void
}

export type LimitOrderAction =
  | {
      type: 'SET_VAULT_ADDRESS'
      payload: LimitOrderState['vaultAddress']
    }
  | { type: 'SET_IS_MODAL_OPEN'; payload: boolean }

export interface LimitOrderContextConfig {
  initialState: Pick<LimitOrderState, 'vaultAddress' | 'vaultChainId'>
}
