import {
  useTradingPanelSettings,
  useTradingPanelType,
} from '@dhedge/core-ui-kit/hooks/state'
import type { ChangeEvent } from 'react'
import { useState } from 'react'

export const useSlippageSelector = () => {
  const [tradingType] = useTradingPanelType()
  const [settings, updateSettings] = useTradingPanelSettings()

  const [invalidSlippage, setInvalidSlippage] = useState<boolean>(false)
  const isCustomSlippage = settings.slippage !== 'auto'

  const handleDefaultSlippageSelected = () => {
    updateSettings({ slippage: 'auto' })
  }

  const handleCustomSlippageChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = e.target.value
    const invalid = +value < 0 || +value > 100
    setInvalidSlippage(invalid)

    let newSlippage = settings.slippage

    if (invalid || (value.trim().length === 0 && isCustomSlippage)) {
      // reset to default value
      newSlippage = 'auto'
    } else if (value.trim().length > 0) {
      newSlippage = +value
    }

    updateSettings({ slippage: newSlippage })
  }

  return {
    settings,
    tradingType,
    isCustomSlippage,
    invalidSlippage,
    onDefaultSlippageSelect: handleDefaultSlippageSelected,
    onCustomSlippageSelect: handleCustomSlippageChange,
  }
}
