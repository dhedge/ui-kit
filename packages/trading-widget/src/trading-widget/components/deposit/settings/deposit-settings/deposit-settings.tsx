import type { FC } from 'react'

import { SettingsOption } from 'trading-widget/components/common'
import {
  SlippageSelector,
  TokenAllowanceSwitch,
} from 'trading-widget/components/widget/widget-settings'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const DepositSettings: FC = () => {
  const t = useTranslationContext()

  return (
    <>
      <SettingsOption
        label={t.slippageTolerance}
        tooltipText={t.depositSlippageWarning}
      >
        <SlippageSelector />
      </SettingsOption>
      <SettingsOption
        label={t.tokenAllowance}
        tooltipText={t.toggleTokenApprovalAmount}
      >
        <TokenAllowanceSwitch />
      </SettingsOption>
    </>
  )
}
