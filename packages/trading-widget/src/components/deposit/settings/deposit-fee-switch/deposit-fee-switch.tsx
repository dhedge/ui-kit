import { Switch } from 'components/common'

import { useTranslationContext } from 'providers/translation-provider'

import { useDepositFeeSwitch } from './deposit-fee-switch.hooks'

export const DepositFeeSwitch = () => {
  const t = useTranslationContext()
  const { defaultEnabled, disabled, onChange } = useDepositFeeSwitch()

  return (
    <Switch
      defaultEnabled={defaultEnabled}
      onChange={onChange}
      disabled={disabled}
      label={t.lengthenLockup}
    />
  )
}
