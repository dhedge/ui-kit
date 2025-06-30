import type { FC } from 'react'

import { Switch } from 'trading-widget/components/common'
import { useBatchTransactionsSwitch } from 'trading-widget/components/widget/widget-settings/batch-transactions-switch/batch-transactions-switch.hooks'

interface BatchTransactionsSwitchProps {
  label?: string
}

export const BatchTransactionsSwitch: FC<BatchTransactionsSwitchProps> = ({
  label,
}) => {
  const [enabled, onToggle] = useBatchTransactionsSwitch()

  return <Switch defaultEnabled={enabled} onChange={onToggle} label={label} />
}
