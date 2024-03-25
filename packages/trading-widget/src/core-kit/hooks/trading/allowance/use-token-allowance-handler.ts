import { useCallback, useMemo } from 'react'

import {
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import {
  useTradingPanelLogger,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

export const useTokenAllowanceHandler = (): [
  boolean,
  (isInfinite: boolean) => void,
] => {
  const [{ isInfiniteAllowance }, updateSettings] = useTradingPanelSettings()
  const log = useTradingPanelLogger()

  const setIsInfiniteAllowance = useCallback(
    (isInfinite: boolean) => {
      updateSettings({ isInfiniteAllowance: isInfinite })
      log?.(TRADING_PANEL_LOG_EVENT.INFINITE_ALLOWANCE_CHANGE, {
        [TRADING_LOG_EVENT_PARAM.IS_INFINITE.NAME]: isInfinite ? 1 : 0,
      })
    },
    [updateSettings, log],
  )

  return useMemo(
    () => [isInfiniteAllowance, setIsInfiniteAllowance],
    [isInfiniteAllowance, setIsInfiniteAllowance],
  )
}
