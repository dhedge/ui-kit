import type { FC } from 'react'

import { SettingsOption } from 'trading-widget/components/common'
import {
  AggregatorsSelector,
  BatchTransactionsSwitch,
  SlippageSelector,
  TokenAllowanceSwitch,
} from 'trading-widget/components/widget/widget-settings'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const WithdrawSettings: FC = () => {
  const t = useTranslationContext()

  return (
    <>
      <SettingsOption
        label={t.slippageTolerance}
        tooltipText={t.withdrawSlippageWarning}
      >
        <SlippageSelector />
      </SettingsOption>
      <SettingsOption
        label={t.tokenAllowance}
        tooltipText={t.toggleTokenApprovalAmount}
      >
        <TokenAllowanceSwitch />
      </SettingsOption>
      <SettingsOption
        label={t.batchTransactionsLabel}
        tooltipText={t.batchTransactionsTooltip ?? ''}
      >
        <BatchTransactionsSwitch />
      </SettingsOption>
      <AggregatorsSelector />
    </>
  )
}
