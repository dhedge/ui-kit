import type { FC } from 'react'

import { Switch } from 'trading-widget/components/common'
import { useBatchTransactionsSwitch } from 'trading-widget/components/widget/widget-settings/batch-transactions-switch/batch-transactions-switch.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const BatchTransactionsSwitch: FC = () => {
  const t = useTranslationContext()
  const [enabled, onToggle] = useBatchTransactionsSwitch()

  return (
    <Switch
      defaultEnabled={enabled}
      onChange={onToggle}
      label={t.batchTransactionsSwitchLabel}
    />
  )
}
