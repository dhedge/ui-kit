import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useNetwork } from 'core-kit/hooks/web3'

import { ActionButton } from 'trading-widget/components/common'

export const SwitchNetworkButton = () => {
  const { switchNetwork } = useNetwork()
  const { chainId } = useTradingPanelPoolConfig()

  const handleSwitch = () => {
    switchNetwork?.({ chainId })
  }

  return <ActionButton onClick={handleSwitch}>Switch Network</ActionButton>
}
