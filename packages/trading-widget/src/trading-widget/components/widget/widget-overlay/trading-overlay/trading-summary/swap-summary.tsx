import type { FC } from 'react'

import type { TradingPanelStateModal } from 'core-kit/types'

interface SwapSummaryProps {
  sendTokens: TradingPanelStateModal['sendTokens']
  receiveToken: TradingPanelStateModal['receiveToken']
}

export const SwapSummary: FC<SwapSummaryProps> = () => {
  return <div>Swap Summary</div>
}
