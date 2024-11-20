import { TRANSACTION_ERRORS } from 'core-kit/const'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

const parseErrorMessage = (error: string | undefined) => {
  if (!error) {
    return null
  }
  const [, reason = ''] = error.split(':').map((s) => s.trim())

  return (
    TRANSACTION_ERRORS[reason] ??
    TRANSACTION_ERRORS[error] ?? { title: 'Transaction failed', hint: error }
  )
}

export const useNotificationOverlay = ({ type }: OverlayProps) => {
  const { handleReject, meta } = useOverlayHandlers({ type })

  return { handleReject, error: parseErrorMessage(meta?.error) }
}
