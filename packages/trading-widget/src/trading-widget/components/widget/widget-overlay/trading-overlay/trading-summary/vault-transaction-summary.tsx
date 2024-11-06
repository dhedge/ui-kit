import type { FC } from 'react'

import type { TradingPanelStateModal } from 'core-kit/types'
import { TokenIcon } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface VaultTransactionSummaryProps {
  sendTokens: TradingPanelStateModal['sendTokens']
  receiveTokens: TradingPanelStateModal['receiveTokens']
  action: TradingPanelStateModal['action']
}

const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 })

export const VaultTransactionSummary: FC<VaultTransactionSummaryProps> = ({
  sendTokens,
  receiveTokens,
  action,
}) => {
  const t = useTranslationContext()
  const [sendToken] = sendTokens ?? []
  const [receiveToken] = receiveTokens ?? []

  if (!sendToken) {
    return null
  }

  return (
    <div className="dtw-flex dtw-flex-wrap dtw-items-center dtw-justify-center dtw-gap-1">
      {action === 'deposit'
        ? t.pay
        : action === 'multi_withdraw'
          ? t.sell
          : t.unrollAction}
      <div className="dtw-flex dtw-items-center dtw-gap-1">
        {formatter.format(+sendToken.value)}{' '}
        <TokenIcon size="sm" symbols={[sendToken.symbol]} /> {sendToken.symbol}
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
            {receiveToken.value ? formatter.format(+receiveToken.value) : null}{' '}
            <TokenIcon size="sm" symbols={[receiveToken.symbol]} />{' '}
            {receiveToken.symbol}
          </>
        )}
      </div>
    </div>
  )
}
