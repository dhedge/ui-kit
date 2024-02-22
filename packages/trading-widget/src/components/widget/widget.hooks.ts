import type { TradingPanelType } from '@dhedge/core-ui-kit/types'
import { useState } from 'react'

import { TABS } from 'constants/tab'

export interface WidgetProps {
  initialType?: TradingPanelType
}

const TRADING_TAB_INDEX_MAP = TABS.reduce<Record<number, TradingPanelType>>(
  (acc, type, index) => {
    acc[index] = type
    return acc
  },
  {},
)

export const useWidget = ({ initialType = TABS[0] }: WidgetProps) => {
  const [type, setTradingType] = useState<TradingPanelType>(initialType)

  const onTabChange = (index: number) => {
    const tab = TRADING_TAB_INDEX_MAP[index]

    if (tab) {
      setTradingType(tab)
    }
  }

  return {
    type,
    onTabChange,
  }
}
