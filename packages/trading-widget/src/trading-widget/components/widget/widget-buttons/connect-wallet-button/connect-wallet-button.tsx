import type { FC } from 'react'

import { useConnect } from 'core-kit/hooks/web3'

import { ActionButton } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useConfigContextActions } from 'trading-widget/providers/config-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const ConnectWalletButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const t = useTranslationContext()
  const { status } = useConnect()
  const { onConnect } = useConfigContextActions()

  return (
    <Button
      onClick={onConnect}
      className="dtw-whitespace-nowrap dtw-text-sm"
      loading={status === 'pending'}
    >
      {t.connectWallet}
    </Button>
  )
}
