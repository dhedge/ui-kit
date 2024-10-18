import { useHighSlippageCheck } from 'trading-widget/hooks'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useValidSwapButton = () => {
  const dispatch = useOverlayDispatchContext()

  const { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed } =
    useHighSlippageCheck()

  const handleHighSlippageClick = () => {
    dispatch({
      type: 'MERGE_OVERLAY',
      payload: {
        type: OVERLAY.HIGH_SLIPPAGE,
        isOpen: true,
        onConfirm: async () => confirmHighSlippage(),
      },
    })
  }

  return {
    requiresHighSlippageConfirm,
    slippageToBeUsed,
    handleHighSlippageClick,
  }
}
