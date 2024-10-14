import type { FC } from 'react'

import { useWithdrawSwapQuote } from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { Layout } from 'trading-widget/components/common'

import { WithdrawBalance } from 'trading-widget/components/withdraw/swap-step/balance/withdraw-balance'
import { SwapButton } from 'trading-widget/components/withdraw/swap-step/button/swap-button/swap-button'
import { ValidSwapButton } from 'trading-widget/components/withdraw/swap-step/button/valid-swap-button/valid-swap-button'
import { InputGroup } from 'trading-widget/components/withdraw/swap-step/input-group/input-group'
import { WithdrawSwapMeta } from 'trading-widget/components/withdraw/swap-step/meta/meta'

export const SwapStep: FC = () => {
  useWithdrawSwapQuote()
  return (
    <>
      <Layout.Balance>
        <WithdrawBalance />
      </Layout.Balance>
      <Layout.InputGroup>
        <InputGroup />
      </Layout.InputGroup>
      <WithdrawSwapMeta>
        <ValidSwapButton>
          <SwapButton />
        </ValidSwapButton>
      </WithdrawSwapMeta>
    </>
  )
}
