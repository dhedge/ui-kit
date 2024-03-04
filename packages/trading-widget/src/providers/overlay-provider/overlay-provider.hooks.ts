import type { Dispatch } from 'react'
import { createContext, useContext, useReducer } from 'react'

import type {
  OverlayProviderAction,
  OverlayProviderState,
} from './overlay-provider.types'

const reducer = (
  state: OverlayProviderState,
  action: OverlayProviderAction,
): OverlayProviderState => {
  switch (action.type) {
    case 'MERGE_OVERLAY':
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          isOpen: action.payload.isOpen,
          onConfirm: action.payload.onConfirm,
        },
      }

    default:
      return state
  }
}

export const useOverlayProvider = () =>
  useReducer(reducer, {
    TERMS_OF_USE: { isOpen: false },
  })

export const OverlayProviderStateContext = createContext<OverlayProviderState>({
  TERMS_OF_USE: { isOpen: false },
})

export const OverlayProviderDispatchContext = createContext<
  Dispatch<OverlayProviderAction>
>(() => {})

export const useOverlayStateContext = () => {
  const context = useContext(OverlayProviderStateContext)

  if (!context) {
    throw new Error('OverlayStateContext is used out of Provider')
  }

  return context
}

export const useOverlayDispatchContext = () => {
  const context = useContext(OverlayProviderDispatchContext)

  if (!context) {
    throw new Error('OverlayDispatchContext is used out of Provider')
  }

  return context
}
