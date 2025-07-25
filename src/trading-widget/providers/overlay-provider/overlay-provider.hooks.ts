import type { Dispatch } from 'react'
import { createContext, useContext, useReducer } from 'react'

import type {
  OverlayProviderAction,
  OverlayProviderState,
} from 'trading-widget/providers/overlay-provider/overlay-provider.types'
import type { OverlayProps } from 'trading-widget/types'
import { OVERLAY } from 'trading-widget/types'

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
          isPending: action.payload.isPending ?? false,
          onConfirm:
            action.payload.onConfirm ?? state[action.payload.type].onConfirm,
          meta: action.payload.meta ?? state[action.payload.type].meta,
        },
      }

    default:
      return state
  }
}

const defaultState: OverlayProviderState = Object.values(OVERLAY).reduce(
  (acc, name) => ({
    ...acc,
    [name]: { isOpen: false, isPending: false },
  }),
  {} as OverlayProviderState,
)

export const useOverlayProvider = () => useReducer(reducer, defaultState)

export const OverlayProviderStateContext =
  createContext<OverlayProviderState>(defaultState)

export const OverlayProviderDispatchContext = createContext<
  Dispatch<OverlayProviderAction>
>(() => {
  // This is a no-op function that will be replaced by the actual dispatch function
  // when the provider is mounted
})

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

export const useOverlayHandlers = ({ type }: OverlayProps) => {
  const state = useOverlayStateContext()
  const dispatch = useOverlayDispatchContext()

  const handleClose = () => {
    dispatch({
      type: 'MERGE_OVERLAY',
      payload: { type, isOpen: false, isPending: false },
    })
  }

  const { onConfirm, isPending, meta } = state[type]

  const setPendingState = (isPending: boolean) => {
    dispatch({
      type: 'MERGE_OVERLAY',
      payload: { type, isOpen: true, isPending },
    })
  }

  const handleConfirm = async () => {
    await onConfirm?.(setPendingState)
    handleClose()
  }

  return {
    handleReject: handleClose,
    handleConfirm,
    isPending,
    meta,
  }
}

export const useCloseAllOverlays = () => {
  const dispatch = useOverlayDispatchContext()

  return () => {
    Object.values(OVERLAY).forEach((type) => {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: { type, isOpen: false, isPending: false },
      })
    })
  }
}
