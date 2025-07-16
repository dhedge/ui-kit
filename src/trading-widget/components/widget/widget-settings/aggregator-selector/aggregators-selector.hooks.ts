import { useCallback } from 'react'

import { useTradingPanelSettings } from 'core-kit/hooks/state'

export const useAggregatorsSelector = () => {
  const [{ availableAggregators, selectedAggregators }, updateSettings] =
    useTradingPanelSettings()

  const onAggregatorToggle = useCallback(
    (aggregator: string) => {
      const newSelectedAggregators = selectedAggregators.includes(aggregator)
        ? selectedAggregators.filter((a) => a !== aggregator)
        : [...selectedAggregators, aggregator]

      updateSettings({ selectedAggregators: newSelectedAggregators })
    },
    [selectedAggregators, updateSettings],
  )

  return {
    availableAggregators,
    selectedAggregators,
    onAggregatorToggle,
  }
}
