import {
  useOverlayDispatchContext,
  useOverlayStateContext,
} from 'providers/overlay-provider'
import type { OverlayProps } from 'types'

export const useTermsOfUseOverlay = ({ type }: OverlayProps) => {
  const state = useOverlayStateContext()
  const dispatch = useOverlayDispatchContext()

  const handleReject = () => {
    dispatch({ type: 'MERGE_OVERLAY', payload: { type, isOpen: false } })
  }

  const { onConfirm } = state[type]

  return {
    handleReject,
    handleConfirm: onConfirm,
  }
}
