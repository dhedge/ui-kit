import { useInitWithdrawQuote } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-quote'
import { Layout } from 'trading-widget/components/common'
import { ValidNetworkButton } from 'trading-widget/components/widget/widget-buttons'
import { InitWithdrawBalance } from 'trading-widget/components/withdraw/init-step/balance/init-withdraw-balance'
import { InitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/init-withdraw-button/init-withdraw-button'
import { ValidInitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/valid-init-withdraw-button/valid-init-withdraw-button'
import { InitWithdrawInputGroup } from 'trading-widget/components/withdraw/init-step/input-group/init-withdraw-input-group'
import { InitWithdrawMeta } from 'trading-widget/components/withdraw/init-step/meta/meta'
import { WithdrawStepper } from 'trading-widget/components/withdraw/stepper/withdraw-stepper'

export const InitStep = () => {
  useInitWithdrawQuote()
  return (
    <>
      <Layout.Balance>
        <InitWithdrawBalance />
      </Layout.Balance>
      <Layout.InputGroup>
        <InitWithdrawInputGroup />
      </Layout.InputGroup>
      <InitWithdrawMeta>
        <WithdrawStepper>
          <ValidNetworkButton>
            <ValidInitWithdrawButton>
              <InitWithdrawButton />
            </ValidInitWithdrawButton>
          </ValidNetworkButton>
        </WithdrawStepper>
      </InitWithdrawMeta>
    </>
  )
}
