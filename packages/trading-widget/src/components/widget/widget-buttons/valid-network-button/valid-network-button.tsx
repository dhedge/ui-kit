import type { FC, PropsWithChildren } from 'react'

import { useValidNetworkButton } from './valid-network-button.hooks'
import { ConnectWalletButton } from '../connect-wallet-button/connect-wallet-button'
import { SwitchNetworkButton } from '../switch-network-button/switch-network-button'

export const ValidNetworkButton: FC<PropsWithChildren> = ({ children }) => {
  const { isDisconnected, isWrongNetwork } = useValidNetworkButton()

  if (!isDisconnected) {
    return <ConnectWalletButton />
  }

  if (!isWrongNetwork) {
    return <SwitchNetworkButton />
  }

  return children
}
