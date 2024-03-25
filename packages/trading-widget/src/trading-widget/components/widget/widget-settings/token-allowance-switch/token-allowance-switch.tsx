import { useTokenAllowanceHandler } from 'core-kit/hooks/trading/allowance'

import { Switch } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

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
