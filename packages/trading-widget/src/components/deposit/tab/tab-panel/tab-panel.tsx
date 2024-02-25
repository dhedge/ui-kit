import type { FC } from 'react'

import { Layout } from 'components/common'
import { ValidNetworkButton } from 'components/widget/widget-buttons'
import { useComponentContext } from 'providers/component-provider'
import { useConfigContextParams } from 'providers/config-provider'

import { ValidDepositButton } from '../../button/valid-deposit-button/valid-deposit-button'
import { DepositMeta } from '../../meta/meta'

export const DepositTabPanel: FC = () => {
  const { isGeoBlocked = false } = useConfigContextParams()
  const { GeoBlockAlert } = useComponentContext()

  return (
    <Layout.Panel>
      <DepositMeta>
        {isGeoBlocked && GeoBlockAlert ? (
          <GeoBlockAlert />
        ) : (
          <ValidNetworkButton>
            <ValidDepositButton>Deposit Trade</ValidDepositButton>
          </ValidNetworkButton>
        )}
      </DepositMeta>
    </Layout.Panel>
  )
}
