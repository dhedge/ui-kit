import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import type { TradingPanelType } from 'core-kit/types'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

// Allows using pool specific translation for trading type
export const useTradingTypeName = (tradingType: TradingPanelType) => {
  const t = useTranslationContext()
  const { symbol } = useTradingPanelPoolConfig()

  const tabKey = `${symbol}${tradingType}`

  return t?.[tabKey] ?? t[tradingType]
}
