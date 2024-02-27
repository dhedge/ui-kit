import type { FC } from 'react'

import { ActionButton } from 'components/common'
import { useConfigContextActions } from 'providers/config-provider'

export const ConnectWalletButton: FC = () => {
  const { onConnect } = useConfigContextActions()

  return (
    <ActionButton
      onClick={onConnect}
      highlighted
      className="dtw-whitespace-nowrap dtw-text-sm tw-w-full"
    >
      Connect Wallet
    </ActionButton>
  )
}
