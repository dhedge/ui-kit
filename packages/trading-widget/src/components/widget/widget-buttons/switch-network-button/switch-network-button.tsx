import { useTradingPanelPoolConfig } from '@dhedge/core-ui-kit/hooks/state'
import { useNetwork } from '@dhedge/core-ui-kit/hooks/web3'

import { ActionButton } from 'components/common'

export const SwitchNetworkButton = () => {
  const { switchNetwork } = useNetwork()
  const { chainId } = useTradingPanelPoolConfig()

  const handleSwitch = () => {
    switchNetwork?.({ chainId })
  }

  return <ActionButton onClick={handleSwitch}>Switch Network</ActionButton>
}
