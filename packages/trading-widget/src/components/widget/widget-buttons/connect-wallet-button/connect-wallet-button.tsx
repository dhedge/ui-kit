import { useConnect } from '@dhedge/core-ui-kit/hooks/web3'
import type { FC } from 'react'

import { ActionButton, Spinner } from 'components/common'
import { useConfigContextActions } from 'providers/config-provider'
import { useTranslationContext } from 'providers/translation-provider'
import { THEME_TYPE } from 'types'

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
