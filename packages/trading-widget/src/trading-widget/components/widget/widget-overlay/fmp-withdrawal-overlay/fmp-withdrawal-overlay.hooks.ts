import { useFlatmoneyPointsUserBalances } from 'core-kit/hooks/user'
import { commify, formatNumberToLimitedDecimals } from 'core-kit/utils'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

export const useFmpWithdrawalOverlay = ({ type }: OverlayProps) => {
  const { handleReject, handleConfirm } = useOverlayHandlers({ type })
  const { unlockTaxAmount, unlockDate, unlockTimestamp, isLoading } =
    useFlatmoneyPointsUserBalances()

  const showUnlockTaxTip = !!unlockTimestamp && Date.now() < unlockTimestamp
  const showUnlockTaxAmount = !!unlockTaxAmount && unlockTaxAmount !== '0'

  return {
    isLoading,
    showUnlockTaxTip,
    showUnlockTaxAmount,
    unlockTaxAmount: commify(formatNumberToLimitedDecimals(unlockTaxAmount, 0)),
    unlockDate,
    handleReject,
    handleConfirm,
  }
}
