import type { FC, PropsWithChildren } from 'react'

import { ConnectWalletButton } from 'trading-widget/components/widget/widget-buttons/connect-wallet-button/connect-wallet-button'
import { SwitchNetworkButton } from 'trading-widget/components/widget/widget-buttons/switch-network-button/switch-network-button'
import { useValidNetworkButton } from 'trading-widget/components/widget/widget-buttons/valid-network-button/valid-network-button.hooks'

export const ValidNetworkButton: FC<PropsWithChildren> = ({ children }) => {
  const { isDisconnected, isWrongNetwork } = useValidNetworkButton()

  if (isDisconnected) {
    return <ConnectWalletButton />
  }

  if (isWrongNetwork) {
    return <SwitchNetworkButton />
  }

  return children
}
