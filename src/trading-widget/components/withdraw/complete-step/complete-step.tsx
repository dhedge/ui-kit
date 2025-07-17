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
import { WithdrawStepper } from 'trading-widget/components/withdraw/stepper/withdraw-stepper'

export const CompleteStep: FC = () => {
  const { showSwapButton } = useCompleteStep()
  return (
    <>
      <Layout.InputGroup>
        <CompleteWithdrawBalance />
        <CompleteWithdrawInputGroup />
      </Layout.InputGroup>
      <CompleteWithdrawMeta>
        <WithdrawStepper>
          <ValidNetworkButton>
            {showSwapButton ? (
              <>
                <ValidSwapButton>
                  <SwapButton />
                </ValidSwapButton>
                <ClaimButton
                  highlighted={false}
                  className="dtw-mt-1.5 !dtw-py-1 dtw-text-[length:var(--panel-input-button-font-size,var(--panel-font-size-xs))]"
                />
              </>
            ) : (
              <ClaimButton />
            )}
          </ValidNetworkButton>
        </WithdrawStepper>
      </CompleteWithdrawMeta>
    </>
  )
}
