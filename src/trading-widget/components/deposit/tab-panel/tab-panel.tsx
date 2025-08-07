import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { ValidDepositButton } from 'trading-widget/components/deposit/button/valid-deposit-button/valid-deposit-button'
import { DepositInputGroup } from 'trading-widget/components/deposit/input-group/input-group'
import { DepositMeta } from 'trading-widget/components/deposit/meta/meta'
import { useDepositTabPanel } from 'trading-widget/components/deposit/tab-panel/tab-panel.hooks'
import { ValidNetworkButton } from 'trading-widget/components/widget/widget-buttons'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

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
