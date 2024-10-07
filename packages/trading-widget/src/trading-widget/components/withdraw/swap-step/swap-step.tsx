import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { Balance } from 'trading-widget/components/withdraw/swap-step/balance/balance'
import { InputGroup } from 'trading-widget/components/withdraw/swap-step/input-group/input-group'
import { Meta } from 'trading-widget/components/withdraw/swap-step/meta/meta'

export const SwapStep: FC = () => {
  return (
    <>
      <Layout.Balance>
        <Balance></Balance>
      </Layout.Balance>
      <Layout.InputGroup>
        <InputGroup />
      </Layout.InputGroup>
      <Meta></Meta>
    </>
  )
}
