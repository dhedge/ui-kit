import type { FC, PropsWithChildren } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useNetworkCheckButton } from 'limit-orders/component/limit-order-button/network-check-button.hooks'

export const NetworkCheckButton: FC<PropsWithChildren> = ({ children }) => {
  const { isWrongNetwork, handleNetworkSwitch } = useNetworkCheckButton()

  if (isWrongNetwork) {
    return (
      <ActionButton onClick={handleNetworkSwitch}>Switch Network</ActionButton>
    )
  }

  return children
}
