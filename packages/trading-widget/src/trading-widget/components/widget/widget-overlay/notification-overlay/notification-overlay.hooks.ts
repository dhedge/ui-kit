import { EasySwapperV2Abi } from 'core-kit/abi'
import { TRANSACTION_ERRORS } from 'core-kit/const'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

const EASY_SWAPPER_ERRORS = EasySwapperV2Abi.filter(
  ({ type }) => type === 'error',
).map(({ name }) => name)

const truncateError = (error: string, maxLength = 150) => {
  if (error.length > maxLength) {
    return error.substring(0, maxLength)
  }
  return error
}

const parseErrorMessage = (error: string | undefined) => {
  if (!error) {
    return null
  }
  const reason = EASY_SWAPPER_ERRORS.find((e) => error.includes(e))
  const [shortMessage] = error
    .split(reason ? '.' : 'Contract')
    .map((s) => s.trim())

  return (
    TRANSACTION_ERRORS[reason ?? error] ?? {
      title: 'Transaction failed',
      hint: `${truncateError(shortMessage ?? '')} ${reason ? `: ${reason}` : ''}`,
    }
  )
}

export const useNotificationOverlay = ({ type }: OverlayProps) => {
  const { handleReject, meta } = useOverlayHandlers({ type })

  return { handleReject, error: parseErrorMessage(meta?.error) }
}
