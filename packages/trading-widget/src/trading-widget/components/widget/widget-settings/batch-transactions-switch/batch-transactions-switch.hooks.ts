import { useCallback, useMemo } from 'react'

import { useTradingPanelSettings } from 'core-kit/hooks/state'

export const useBatchTransactionsSwitch = (): [
  boolean,
  (enabled: boolean) => void,
] => {
  const [{ isBatchTransactionsEnabled }, updateSettings] =
    useTradingPanelSettings()

  const setIsBatchTransactions = useCallback(
    (enabled: boolean) => {
      updateSettings({ isBatchTransactionsEnabled: enabled })
    },
    [updateSettings],
  )

  return useMemo(
    () => [isBatchTransactionsEnabled, setIsBatchTransactions],
    [isBatchTransactionsEnabled, setIsBatchTransactions],
  )
}
