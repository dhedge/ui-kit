import { EasySwapperV2Abi } from 'core-kit/abi'
import { parseContractErrorMessage } from 'core-kit/utils'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

const EASY_SWAPPER_ERRORS = EasySwapperV2Abi.filter(
  ({ type }) => type === 'error',
).map(({ name }) => name)

export const useNotificationOverlay = ({ type }: OverlayProps) => {
  const { handleReject, meta } = useOverlayHandlers({ type })

  return {
    handleReject,
    error: parseContractErrorMessage({
      errorMessage: meta?.error,
      abiErrors: EASY_SWAPPER_ERRORS,
    }),
  }
}
