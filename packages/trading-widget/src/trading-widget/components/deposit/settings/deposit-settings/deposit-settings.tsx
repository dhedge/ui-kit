import type { FC } from 'react'

import { SettingsOption } from 'trading-widget/components/common'
import {
  SlippageSelector,
  TokenAllowanceSwitch,
} from 'trading-widget/components/widget/widget-settings'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useDepositSettings } from './deposit-settings.hooks'
import { DepositFeeSwitch } from '../deposit-fee-switch/deposit-fee-switch'

export const DepositSettings: FC = () => {
  const t = useTranslationContext()
  const { customLockTime, defaultLockTime, hasPoolEntryFee } =
    useDepositSettings()

  return (
    <>
      <SettingsOption
        label={t.slippageTolerance}
        tooltipText={t.depositSlippageWarning}
      >
        <SlippageSelector />
      </SettingsOption>
      {!hasPoolEntryFee && (
        <SettingsOption
          label={t.bypassEntryFee}
          tooltipText={t.entryFeeSwitchWarning
            .replace('{defaultLockTime}', defaultLockTime)
            .replace('{customLockTime}', customLockTime)}
        >
          <DepositFeeSwitch />
        </SettingsOption>
      )}
      <SettingsOption
        label={t.tokenAllowance}
        tooltipText={t.toggleTokenApprovalAmount}
      >
        <TokenAllowanceSwitch />
      </SettingsOption>
    </>
  )
}
