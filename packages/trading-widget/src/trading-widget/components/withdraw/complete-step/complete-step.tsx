import type { FC } from 'react'

import { useCompleteWithdrawQuote } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { Layout } from 'trading-widget/components/common'

import { ValidNetworkButton } from 'trading-widget/components/widget/widget-buttons'
import { CompleteWithdrawBalance } from 'trading-widget/components/withdraw/complete-step/balance/complete-withdraw-balance'
import { SwapButton } from 'trading-widget/components/withdraw/complete-step/button/swap-button/swap-button'
import { ValidSwapButton } from 'trading-widget/components/withdraw/complete-step/button/valid-swap-button/valid-swap-button'
import { CompleteWithdrawInputGroup } from 'trading-widget/components/withdraw/complete-step/input-group/complete-withdraw-input-group'
import { CompleteWithdrawMeta } from 'trading-widget/components/withdraw/complete-step/meta/meta'

export const CompleteStep: FC = () => {
  useCompleteWithdrawQuote()
  return (
    <>
      <Layout.Balance>
        <CompleteWithdrawBalance />
      </Layout.Balance>
      <Layout.InputGroup>
        <CompleteWithdrawInputGroup />
      </Layout.InputGroup>
      <CompleteWithdrawMeta>
        <ValidNetworkButton>
          <ValidSwapButton>
            <SwapButton />
          </ValidSwapButton>
        </ValidNetworkButton>
      </CompleteWithdrawMeta>
    </>
  )
}
