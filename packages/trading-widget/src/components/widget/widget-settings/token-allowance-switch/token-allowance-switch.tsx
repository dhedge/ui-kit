import { useTokenAllowanceHandler } from '@dhedge/core-ui-kit/hooks/trading/allowance'

import { Switch } from 'components/common'
import { useTranslationContext } from 'providers/translation-provider'

export const TokenAllowanceSwitch = () => {
  const t = useTranslationContext()
  const [isInfiniteAllowance, onChange] = useTokenAllowanceHandler()

  return (
    <Switch
      defaultEnabled={isInfiniteAllowance}
      onChange={onChange}
      label={t.infinite}
    />
  )
}
