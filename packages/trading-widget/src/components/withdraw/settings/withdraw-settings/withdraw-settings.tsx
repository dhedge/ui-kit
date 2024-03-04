import type { FC } from 'react'

import { SettingsOption } from 'components/common'
import {
  SlippageSelector,
  TokenAllowanceSwitch,
} from 'components/widget/widget-settings'
import { useTranslationContext } from 'providers/translation-provider'

export const WithdrawSettings: FC = () => {
  const t = useTranslationContext()

  return (
    <>
      <SettingsOption
        label={t.slippageTolerance}
        tooltipText={t.slippageWarning}
      >
        <SlippageSelector />
      </SettingsOption>
      <SettingsOption
        label={t.tokenAllowance}
        tooltipText={t.tokenAmountToApprove}
      >
        <TokenAllowanceSwitch />
      </SettingsOption>
    </>
  )
}
