import type { FC } from 'react'

import { useConnect } from 'core-kit/hooks/web3'

import { ActionButton, Spinner } from 'trading-widget/components/common'
import { useConfigContextActions } from 'trading-widget/providers/config-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import { THEME_TYPE } from 'trading-widget/types'

export const ConnectWalletButton: FC = () => {
  const t = useTranslationContext()
  const { status } = useConnect()
  const { onConnect } = useConfigContextActions()

  return (
    <ActionButton
      onClick={onConnect}
      className="dtw-whitespace-nowrap dtw-text-sm"
    >
      <div className="dtw-flex dtw-items-center dtw-justify-center dtw-gap-2">
        <span>{t.connectWallet}</span>
        {status === 'pending' && (
          <Spinner type={THEME_TYPE.DEFAULT} className="dtw-h-4 dtw-w-4" />
        )}
      </div>
    </ActionButton>
  )
}
