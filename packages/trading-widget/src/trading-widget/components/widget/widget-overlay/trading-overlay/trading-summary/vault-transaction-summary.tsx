import type { FC } from 'react'

import type { TradingPanelStateModal } from 'core-kit/types'
import { TokenIcon } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const VaultTransactionSummary: FC<
  Pick<
    TradingPanelStateModal,
    'sendTokens' | 'receiveTokens' | 'action' | 'status'
  >
> = ({ sendTokens, receiveTokens, action, status }) => {
  const t = useTranslationContext()
  const [sendToken] = sendTokens ?? []
  const [receiveToken] = receiveTokens ?? []
  const showNextStepTip = action === 'single_withdraw' && status === 'Success'

  if (!sendToken) {
    return null
  }

  return (
    <>
      <div className="dtw-flex dtw-flex-wrap dtw-items-center dtw-gap-x-1">
        {action === 'deposit'
          ? t.pay
          : action === 'multi_withdraw'
            ? t.sell
            : t.unrollAction}
        <div className="dtw-flex dtw-items-center dtw-gap-1">
          <TokenIcon size="sm" symbols={[sendToken.symbol]} />{' '}
          {sendToken.symbol}
        </div>{' '}
        to receive
        <div className="dtw-flex dtw-items-center dtw-gap-1">
          {!receiveToken ? (
            <>
              {action === 'multi_withdraw'
                ? t.multiAssetFractions
                : t.swappableAssets}
            </>
          ) : (
            <>
              <TokenIcon size="sm" symbols={[receiveToken.symbol]} />{' '}
              {receiveToken.symbol}
            </>
          )}
        </div>
      </div>
      {showNextStepTip && (
        <p className="dtw-text-xs">{t.proceedWithNextStep}</p>
      )}
    </>
  )
}
