import type { FC } from 'react'

import type { TradingPanelStateModal } from 'core-kit/types'
import { TokenIcon } from 'trading-widget/components/common'

interface SwapSummaryProps {
  sendTokens: TradingPanelStateModal['sendTokens']
  receiveTokens: TradingPanelStateModal['receiveTokens']
}

export const SwapSummary: FC<SwapSummaryProps> = ({
  sendTokens,
  receiveTokens,
}) => {
  const [receiveToken] = receiveTokens ?? []
  if (!sendTokens || !receiveToken) {
    return null
  }

  return (
    <div className="dtw-flex dtw-flex-wrap dtw-items-center dtw-justify-center dtw-gap-1">
      Swap of{' '}
      {sendTokens.map((sendToken, index) => (
        <div
          key={sendToken.address}
          className="dtw-flex dtw-items-center dtw-gap-1"
        >
          <TokenIcon size="sm" symbols={[sendToken.symbol]} />{' '}
          {sendToken.symbol}
          {index !== sendTokens.length - 1 && ','}
        </div>
      ))}
      to
      <div className="dtw-flex dtw-items-center dtw-gap-1">
        <TokenIcon size="sm" symbols={[receiveToken.symbol]} />{' '}
        {receiveToken.symbol}
      </div>
    </div>
  )
}
