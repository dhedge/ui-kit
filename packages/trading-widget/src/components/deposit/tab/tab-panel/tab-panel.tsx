import type { FC } from 'react'

import { Layout } from 'components/common'
import { ValidNetworkButton } from 'components/widget/widget-buttons'
import { useComponentContext } from 'providers/component-provider'
import { useConfigContextParams } from 'providers/config-provider'

import { DepositTradeButton } from '../../button/trade-button/trade-button'
import { ValidDepositButton } from '../../button/valid-deposit-button/valid-deposit-button'
import { DepositMeta } from '../../meta/meta'

export const DepositTabPanel: FC = () => {
  const { isGeoBlocked } = useConfigContextParams()
  const { GeoBlockAlert } = useComponentContext()

  return (
    <Layout.Panel>
      <DepositMeta>
        {isGeoBlocked && GeoBlockAlert ? (
          <GeoBlockAlert />
        ) : (
          <ValidNetworkButton>
            <ValidDepositButton>
              <DepositTradeButton />
            </ValidDepositButton>
          </ValidNetworkButton>
        )}
      </DepositMeta>
    </Layout.Panel>
  )
}
