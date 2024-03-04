import {
  useGeneralTradingPanelHandlers,
  useOnTradingTypeChange,
} from '@dhedge/core-ui-kit/hooks/component'
import {
  useTradingPanelPoolConfig,
  useTradingPanelType,
} from '@dhedge/core-ui-kit/hooks/state'
import type { TradingPanelType } from '@dhedge/core-ui-kit/types'
import { useEffect } from 'react'

import { TABS } from 'constants/tab'

const TRADING_TAB_INDEX_MAP = TABS.reduce<Record<number, TradingPanelType>>(
  (acc, type, index) => {
    acc[index] = type
    return acc
  },
  {},
)

export const useWidget = () => {
  const [type] = useTradingPanelType()
  const poolConfig = useTradingPanelPoolConfig()

  useGeneralTradingPanelHandlers()

  const onTradingTypeChange = useOnTradingTypeChange()

  const onTabChange = (index: number) => {
    const newType = TRADING_TAB_INDEX_MAP[index]

    if (newType) {
      onTradingTypeChange(newType)
    }
  }

  useEffect(() => {
    onTradingTypeChange('deposit') // Reset to "Deposit" tab on product change to set correct input tokens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolConfig.address])
  return {
    type,
    onTabChange,
  }
}
