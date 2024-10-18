import { Layout } from 'trading-widget/components/common'
import { ValidNetworkButton } from 'trading-widget/components/widget/widget-buttons'
import { InitWithdrawBalance } from 'trading-widget/components/withdraw/init-step/balance/init-withdraw-balance'
import { InitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/init-withdraw-button/init-withdraw-button'
import { ValidInitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/valid-init-withdraw-button/valid-init-withdraw-button'
import { InitWithdrawInputGroup } from 'trading-widget/components/withdraw/init-step/input-group/init-withdraw-input-group'
import { InitWithdrawMeta } from 'trading-widget/components/withdraw/init-step/meta/meta'

export const InitStep = () => (
  <>
    <Layout.Balance>
      <InitWithdrawBalance />
    </Layout.Balance>
    <Layout.InputGroup>
      <InitWithdrawInputGroup />
    </Layout.InputGroup>
    <InitWithdrawMeta>
      <ValidNetworkButton>
        <ValidInitWithdrawButton>
          <InitWithdrawButton />
        </ValidInitWithdrawButton>
      </ValidNetworkButton>
    </InitWithdrawMeta>
  </>
)
