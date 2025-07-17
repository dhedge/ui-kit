import { useCallback, useMemo } from 'react'

import {
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import {
  useTradingPanelLogger,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

export const useBatchTransactionsSwitch = (): [
  boolean,
  (enabled: boolean) => void,
] => {
  const [{ isBatchTransactionsEnabled }, updateSettings] =
    useTradingPanelSettings()

  const log = useTradingPanelLogger()

  const setIsBatchTransactions = useCallback(
    (enabled: boolean) => {
      updateSettings({ isBatchTransactionsEnabled: enabled })
      log?.(TRADING_PANEL_LOG_EVENT.BATCH_TRANSACTIONS_CHANGE, {
        [TRADING_LOG_EVENT_PARAM.IS_BATCH_TRANSACTIONS_ENABLED.NAME]: enabled
          ? 1
          : 0,
      })
    },
    [updateSettings, log],
  )

  return useMemo(
    () => [isBatchTransactionsEnabled, setIsBatchTransactions],
    [isBatchTransactionsEnabled, setIsBatchTransactions],
  )
}
