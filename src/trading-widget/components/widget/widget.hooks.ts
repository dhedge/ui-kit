import { useEffect } from 'react'

import {
  useGeneralTradingPanelHandlers,
  useOnTradingTypeChange,
} from 'core-kit/hooks/component'
import {
  useTradingPanelPoolConfig,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import type { TradingPanelType } from 'core-kit/types'
import { TABS } from 'trading-widget/constants/tab'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

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
  const { standalone } = useConfigContextParams()

  useGeneralTradingPanelHandlers()

  const onTradingTypeChange = useOnTradingTypeChange()

  const onTabChange = (index: number) => {
    const newType = TRADING_TAB_INDEX_MAP[index]

    if (newType) {
      onTradingTypeChange(newType)
    }
  }

  useEffect(() => {
    if (!standalone) {
      onTradingTypeChange('deposit')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolConfig.address, standalone])

  useEffect(() => {
    if (standalone) {
      onTradingTypeChange(type)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolConfig.address, standalone, type])

  return {
    type,
    onTabChange,
  }
}
