import type { FC } from 'react'

import { Layout } from 'components/common'
import { ValidNetworkButton } from 'components/widget/widget-buttons'
import { useComponentContext } from 'providers/component-provider'
import { useConfigContextParams } from 'providers/config-provider'

import { useDepositTabPanel } from './tab-panel.hooks'
import { DepositBalance } from '../balance/balance'
import { DepositTradeButton } from '../button/trade-button/trade-button'
import { ValidDepositButton } from '../button/valid-deposit-button/valid-deposit-button'
import { DepositInputGroup } from '../input-group/input-group'
import { DepositMeta } from '../meta/meta'

export const DepositTab: FC = () => {
  useDepositTabPanel()

  const { isGeoBlocked } = useConfigContextParams()
  const { GeoBlockAlert, ExtraActionButton } = useComponentContext()

  return (
    <>
      <Layout.Balance>
        <DepositBalance />
      </Layout.Balance>
      <Layout.InputGroup>
        <DepositInputGroup />
      </Layout.InputGroup>
      <DepositMeta>
        {isGeoBlocked && GeoBlockAlert ? (
          <GeoBlockAlert />
        ) : (
          <>
            <ValidNetworkButton>
              <ValidDepositButton>
                <DepositTradeButton />
              </ValidDepositButton>
            </ValidNetworkButton>
            {ExtraActionButton && <ExtraActionButton />}
          </>
        )}
      </DepositMeta>
    </>
  )
}

export const DepositTabPanel: FC = () => (
  <Layout.Panel>
    <DepositTab />
  </Layout.Panel>
)
