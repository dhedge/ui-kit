import type { FC } from 'react'

import { Layout } from 'components/common'
import { useComponentContext } from 'providers/component-provider'
import { useConfigContext } from 'providers/config-provider'

import { DepositMeta } from '../../meta/meta'

export const DepositTabPanel: FC = () => {
  const { isGeoBlocked = false } = useConfigContext()
  const { GeoBlockAlert } = useComponentContext()

  return (
    <Layout.Panel>
      <DepositMeta>
        {isGeoBlocked && GeoBlockAlert ? (
          <GeoBlockAlert />
        ) : (
          <>Deposit Action Buttons</>
        )}
      </DepositMeta>
    </Layout.Panel>
  )
}
