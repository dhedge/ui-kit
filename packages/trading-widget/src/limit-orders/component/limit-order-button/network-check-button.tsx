import type { FC, PropsWithChildren } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useNetworkCheckButton } from 'limit-orders/component/limit-order-button/network-check-button.hooks'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'

export const NetworkCheckButton: FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslationContext()
  const { isWrongNetwork, handleNetworkSwitch } = useNetworkCheckButton()

  if (isWrongNetwork) {
    return (
      <ActionButton onClick={handleNetworkSwitch}>
        {t.switchNetwork}
      </ActionButton>
    )
  }

  return children
}
