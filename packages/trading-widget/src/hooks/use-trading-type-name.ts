import { useTradingPanelPoolConfig } from '@dhedge/core-ui-kit/hooks/state'
import type { TradingPanelType } from '@dhedge/core-ui-kit/types'

import { useTranslationContext } from 'providers/translation-provider'

// Allows using pool specific translation for trading type
export const useTradingTypeName = (tradingType: TradingPanelType) => {
  const t = useTranslationContext()
  const { symbol } = useTradingPanelPoolConfig()

  const tabKey = `${symbol}${tradingType}`

  return t?.[tabKey] ?? t[tradingType]
}
