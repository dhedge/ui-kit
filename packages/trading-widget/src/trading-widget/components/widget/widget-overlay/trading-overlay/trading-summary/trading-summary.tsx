import type { FC } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import { TokenIcon } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 })

export const TradingSummary: FC = () => {
  const t = useTranslationContext()
  const [{ action, receiveToken, sendToken }] = useTradingPanelModal()

  if (action === 'oraclesUpdate') {
    return (
      <div className="dtw-flex dtw-items-center dtw-justify-center dtw-gap-1 dtw-flex-wrap dtw-overflow-hidden">
        {t.updateSynthetixOracles}
      </div>
    )
  }

  if (action === 'approve' && sendToken) {
    return (
      <div className="dtw-flex dtw-items-center dtw-justify-center dtw-gap-1 dtw-flex-wrap dtw-overflow-hidden">
        <span>{t.approveSpending}</span>
        <TokenIcon size="sm" symbols={[sendToken.symbol]} />
        <span>{sendToken.symbol}</span>
      </div>
    )
  }

  if (!sendToken || !receiveToken) return null

  return (
    <div className="dtw-flex dtw-flex-wrap dtw-items-center dtw-justify-center dtw-gap-1">
      {action === 'deposit' ? t.pay : t.sell}
      <div className="dtw-flex dtw-items-center dtw-gap-1">
        {formatter.format(+sendToken.value)}{' '}
        <TokenIcon size="sm" symbols={[sendToken.symbol]} /> {sendToken.symbol}
      </div>{' '}
      to receive
      <div className="dtw-flex dtw-items-center dtw-gap-1">
        {receiveToken.symbol === 'all' ? (
          t.multiAssetFractions
        ) : (
          <>
            {formatter.format(+receiveToken.value)}{' '}
            <TokenIcon size="sm" symbols={[receiveToken.symbol]} />{' '}
            {receiveToken.symbol}
          </>
        )}
      </div>
    </div>
  )
}
