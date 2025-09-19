import { formatDuration, intervalToDuration } from 'date-fns'

import { usePoolDynamicExitRemainingCooldown } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useIsLimitOrderWithdraw } from 'core-kit/hooks/trading/limit-order-withdraw/use-is-limit-order-withdraw'
import { useInitWithdrawAllowance } from 'core-kit/hooks/trading/withdraw-v2/init-step'

import { useIsInsufficientBalance } from 'core-kit/hooks/user'
import { useHighSlippageCheck } from 'trading-widget/hooks'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useValidInitWithdrawButton = () => {
  const { address, chainId, maintenance, maintenanceWithdrawals, symbol } =
    useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const dispatch = useOverlayDispatchContext()
  const isLimitOrderWithdraw = useIsLimitOrderWithdraw()
  const insufficientBalance = useIsInsufficientBalance()

  const { data: dynamicCooldownMs = 0 } = usePoolDynamicExitRemainingCooldown({
    address,
    chainId,
  })

  const dynamicCooldownActive = dynamicCooldownMs > 0
  const dynamicCooldownEndsInTime = formatDuration(
    intervalToDuration({ start: 0, end: dynamicCooldownMs }),
  )

  const { approve, canSpend } = useInitWithdrawAllowance()
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
    requiresEndOfCooldown: dynamicCooldownActive,
    requiresApprove: !canSpend,
    requiresHighSlippageConfirm,
    sendTokenSymbol: sendToken.symbol,
    slippageToBeUsed,
    dynamicCooldownEndsInTime,
    approve,
    handleHighSlippageClick,
    maintenance: maintenance || maintenanceWithdrawals,
    poolSymbol: symbol,
    isLimitOrderWithdraw,
    insufficientBalance,
  }
}
