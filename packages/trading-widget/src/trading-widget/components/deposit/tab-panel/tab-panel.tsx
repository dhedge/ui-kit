import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'
import { ValidNetworkButton } from 'trading-widget/components/widget/widget-buttons'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

import { useDepositTabPanel } from './tab-panel.hooks'
import { DepositBalance } from '../balance/balance'
import { ValidDepositButton } from '../button/valid-deposit-button/valid-deposit-button'
import { DepositInputGroup } from '../input-group/input-group'
import { DepositMeta } from '../meta/meta'

export const DepositTab: FC = () => {
  useDepositTabPanel()

  const { isGeoBlocked, isSanctioned } = useConfigContextParams()
  const { GeoBlockAlert, SanctionedAlert, CustomDepositMeta } =
    useComponentContext()

  const isBlocked = isGeoBlocked || isSanctioned
  const alerts = [
    {
      Component: GeoBlockAlert,
      value: isGeoBlocked,
      key: 'geo-block',
    },
    {
      Component: SanctionedAlert,
      value: isSanctioned,
      key: 'sanctioned',
    },
  ].filter(({ value }) => value)

  return (
    <>
      <Layout.Balance>
        <DepositBalance />
      </Layout.Balance>
      <Layout.InputGroup>
        <DepositInputGroup />
      </Layout.InputGroup>
      {CustomDepositMeta && <CustomDepositMeta />}
      <DepositMeta>
        {isBlocked ? (
          alerts.map(
            ({ Component, key }) => Component && <Component key={key} />,
          )
        ) : (
          <>
            <ValidNetworkButton>
              <ValidDepositButton />
            </ValidNetworkButton>
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
