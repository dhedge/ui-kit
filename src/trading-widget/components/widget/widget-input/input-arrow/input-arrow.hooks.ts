import { useOnTradingTypeChange } from 'core-kit/hooks/component'
import { useTradingPanelType } from 'core-kit/hooks/state'
import { TABS } from 'trading-widget/constants/tab'

export const useInputArrow = () => {
  const [type] = useTradingPanelType()
  const onChange = useOnTradingTypeChange()

  const handleClick = () => {
    const newType = TABS.find((tab) => tab !== type)
    if (newType) {
      onChange(newType)
    }
  }

  return {
    handleClick,
  }
}
