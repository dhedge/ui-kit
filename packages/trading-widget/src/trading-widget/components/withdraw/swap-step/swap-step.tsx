import type { FC } from 'react'

import { useSwapQuote } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-swap-quote'
import { Layout } from 'trading-widget/components/common'

import { WithdrawBalance } from 'trading-widget/components/withdraw/swap-step/balance/withdrawBalance'
import { InputGroup } from 'trading-widget/components/withdraw/swap-step/input-group/input-group'
import { WithdrawSwapMeta } from 'trading-widget/components/withdraw/swap-step/meta/meta'
import { SwapTradeButton } from 'trading-widget/components/withdraw/swap-step/trade-button/swap-trade-button'

export const SwapStep: FC = () => {
  useSwapQuote()
  return (
    <>
      <Layout.Balance>
        <WithdrawBalance />
      </Layout.Balance>
      <Layout.InputGroup>
        <InputGroup />
      </Layout.InputGroup>
      <WithdrawSwapMeta>
        <SwapTradeButton />
      </WithdrawSwapMeta>
    </>
  )
}
