import { useMemo } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import type { TradingModalStatus } from 'core-kit/types'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import type { OverlayProps } from 'trading-widget/types'

export type TradingOverlayProps = OverlayProps

export const useTradingOverlay = ({ type }: TradingOverlayProps) => {
  const t = useTranslationContext()
  const [{ status, link, action }, updateTradingModal] = useTradingPanelModal()
  const isSuccessTx = status == 'Success'
  const { handleReject } = useOverlayHandlers({ type })
  const showNextStepTip = action === 'single_withdraw' && isSuccessTx
  const displaySuccessDepositOverlay = isSuccessTx && action === 'deposit'
  const displayLimitOrderTransactionOverlay =
    action === 'create_limit_sell_order'

  const statusMap = useMemo<Partial<Record<TradingModalStatus, string>>>(
    () => ({
      Wallet: t.sendingOrderToWallet,
      None: t.settingUpTx,
      Mining: t.miningTx,
    }),
    [t],
  )

  const onClose = () => {
    updateTradingModal({ isOpen: false })
    handleReject()
  }

  return {
    title: statusMap[status] ?? status,
    isSuccessTx,
    link,
    onClose,
    showNextStepTip,
    displaySuccessDepositOverlay,
    displayLimitOrderTransactionOverlay,
  }
}
