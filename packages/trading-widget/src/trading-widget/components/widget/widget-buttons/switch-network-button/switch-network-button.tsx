import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useNetwork } from 'core-kit/hooks/web3'

import { ActionButton } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const SwitchNetworkButton = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { switchNetwork } = useNetwork()
  const { chainId } = useTradingPanelPoolConfig()
  const t = useTranslationContext()

  const handleSwitch = () => {
    switchNetwork?.({ chainId })
  }

  return <Button onClick={handleSwitch}>{t.switchNetwork}</Button>
}
