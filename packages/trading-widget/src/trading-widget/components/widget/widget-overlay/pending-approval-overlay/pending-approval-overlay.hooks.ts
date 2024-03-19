import {
  useTradingPanelApprovingStatus,
  useTradingPanelTransactions,
} from '@dhedge/core-ui-kit/hooks/state'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const usePendingApprovalOverlay = () => {
  const t = useTranslationContext()
  const [approvingStatus] = useTradingPanelApprovingStatus()
  const [pendingTransactions] = useTradingPanelTransactions()

  const text =
    approvingStatus === 'pending'
      ? pendingTransactions.length === 0
        ? t.confirmInWallet
        : t.pending
      : undefined

  return {
    text,
  }
}
