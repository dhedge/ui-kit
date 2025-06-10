import type { FC } from 'react'

import {
  Checkbox as DefaultCheckbox,
  SettingsOption,
} from 'trading-widget/components/common'
import { useAggregatorsSelector } from 'trading-widget/components/widget/widget-settings/aggregator-selector/aggregators-selector.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const AggregatorsSelector: FC = () => {
  const t = useTranslationContext()
  const { Checkbox = DefaultCheckbox } = useComponentContext()
  const { availableAggregators, selectedAggregators, onAggregatorToggle } =
    useAggregatorsSelector()

  // If there is only one aggregator available, we don't need to show the selector
  if (availableAggregators.length <= 1) {
    return null
  }

  return (
    <SettingsOption
      label={t.aggregatorsLabel}
      tooltipText={t.aggregatorsTooltip}
    >
      <div className="dtw-flex dtw-flex-col dtw-gap-2">
        {availableAggregators.map((aggregator) => (
          <label
            key={aggregator}
            className="dtw-flex dtw-items-center dtw-gap-2 dtw-text-sm dtw-text-[var(--panel-content-color)] dtw-cursor-pointer"
          >
            <Checkbox
              checked={selectedAggregators.includes(aggregator)}
              onChange={() => onAggregatorToggle(aggregator)}
              className="dtw-size-4"
            />
            {aggregator}
          </label>
        ))}
      </div>
    </SettingsOption>
  )
}
