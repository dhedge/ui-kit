import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useNetwork } from 'core-kit/hooks/web3'

import { ActionButton } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const SwitchNetworkButton = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { switchNetwork } = useNetwork()
  const { chainId } = useTradingPanelPoolConfig()

  const handleSwitch = () => {
    switchNetwork?.({ chainId })
  }

  return <Button onClick={handleSwitch}>Switch Network</Button>
}
