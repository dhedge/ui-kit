import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo, useReducer } from 'react'

import { AddressZero } from 'core-kit/const'

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
  config: Pick<LimitOrderState, 'vaultAddress' | 'vaultChainId'>,
): LimitOrderState => {
  return {
    vaultAddress: config.vaultAddress,
    vaultChainId: config.vaultChainId,
    isModalOpen: false,
  }
}

export const LimitOrderStateContext = createContext<LimitOrderState>(
  getDefaultLimitOrderState({ vaultAddress: AddressZero, vaultChainId: 0 }),
)

export const LimitOrderActionsContext = createContext<LimitOrderActionsState>({
  setVaultAddress: noop,
  setIsModalOpen: noop,
})

const reducer = (
  state: LimitOrderState,
  action: LimitOrderAction,
): LimitOrderState => {
  switch (action.type) {
    case 'SET_VAULT_ADDRESS':
      return {
        ...state,
        vaultAddress: action.payload,
      }
    case 'SET_IS_MODAL_OPEN':
      return {
        ...state,
        isModalOpen: action.payload,
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

  const setVaultAddress = useCallback(
    (payload: LimitOrderState['vaultAddress']) => {
      dispatch({ type: 'SET_VAULT_ADDRESS', payload })
    },
    [],
  )

  const setIsModalOpen = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload })
  }, [])

  const actions: LimitOrderActionsState = useMemo(
    () => ({
      setVaultAddress,
      setIsModalOpen,
    }),
    [setVaultAddress, setIsModalOpen],
  )

  return (
    <LimitOrderActionsContext.Provider value={actions}>
      <LimitOrderStateContext.Provider value={state}>
        {children}
      </LimitOrderStateContext.Provider>
    </LimitOrderActionsContext.Provider>
  )
}
