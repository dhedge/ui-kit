import { Switch } from 'trading-widget/components/common'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useDepositFeeSwitch } from './deposit-fee-switch.hooks'
import { useDepositSettings } from '../deposit-settings/deposit-settings.hooks'

export const DepositFeeSwitch = () => {
  const t = useTranslationContext()
  const { defaultEnabled, disabled, onChange } = useDepositFeeSwitch()
  const { customLockTime } = useDepositSettings()

  return (
    <Switch
      defaultEnabled={defaultEnabled}
      onChange={onChange}
      disabled={disabled}
      label={t.reduceLockup.replace('{customLockTime}', customLockTime)}
    />
  )
}
