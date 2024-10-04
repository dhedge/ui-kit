import { Layout } from 'trading-widget/components/common'
import { ValidNetworkButton } from 'trading-widget/components/widget/widget-buttons'
import { WithdrawBalance } from 'trading-widget/components/withdraw/unroll-step/balance/balance'
import { WithdrawTradeButton } from 'trading-widget/components/withdraw/unroll-step/button/trade-button/trade-button'
import { ValidWithdrawButton } from 'trading-widget/components/withdraw/unroll-step/button/valid-withdraw-button/valid-withdraw-button'
import { WithdrawInputGroup } from 'trading-widget/components/withdraw/unroll-step/input-group/input-group'
import { WithdrawMeta } from 'trading-widget/components/withdraw/unroll-step/meta/meta'

export const UnrollStep = () => (
  <>
    <Layout.Balance>
      <WithdrawBalance />
    </Layout.Balance>
    <Layout.InputGroup>
      <WithdrawInputGroup />
    </Layout.InputGroup>
    <WithdrawMeta>
      <ValidNetworkButton>
        <ValidWithdrawButton>
          <WithdrawTradeButton />
        </ValidWithdrawButton>
      </ValidNetworkButton>
    </WithdrawMeta>
  </>
)
