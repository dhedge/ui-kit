import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { ValidNetworkButton } from 'trading-widget/components/widget/widget-buttons'
import { CompleteWithdrawBalance } from 'trading-widget/components/withdraw/complete-step/balance/complete-withdraw-balance'
import { ClaimButton } from 'trading-widget/components/withdraw/complete-step/button/claim-button/claim-button'
import { SwapButton } from 'trading-widget/components/withdraw/complete-step/button/swap-button/swap-button'
import { ValidSwapButton } from 'trading-widget/components/withdraw/complete-step/button/valid-swap-button/valid-swap-button'
import { useCompleteStep } from 'trading-widget/components/withdraw/complete-step/complete-step.hooks'
import { CompleteWithdrawInputGroup } from 'trading-widget/components/withdraw/complete-step/input-group/complete-withdraw-input-group'
import { CompleteWithdrawMeta } from 'trading-widget/components/withdraw/complete-step/meta/meta'

export const CompleteStep: FC = () => {
  const { hasSwappableAssets } = useCompleteStep()
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
          {hasSwappableAssets ? (
            <ValidSwapButton>
              <SwapButton />
            </ValidSwapButton>
          ) : (
            <ClaimButton />
          )}
        </ValidNetworkButton>
      </CompleteWithdrawMeta>
    </>
  )
}
