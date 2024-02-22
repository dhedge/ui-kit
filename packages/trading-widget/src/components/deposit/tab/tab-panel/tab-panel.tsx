import type { FC } from 'react'

import { TabPanel } from 'components/common'
import { useComponentContext } from 'providers/component-provider'
import { useConfigContext } from 'providers/config-provider'

import { DepositMeta } from '../../meta/meta'

export const DepositTabPanel: FC = () => {
  const { isGeoBlocked = false } = useConfigContext()
  const { GeoBlockAlert } = useComponentContext()

  return (
    <TabPanel>
      <DepositMeta>
        {isGeoBlocked && GeoBlockAlert ? (
          <GeoBlockAlert />
        ) : (
          <>Deposit Action Buttons</>
        )}
      </DepositMeta>
    </TabPanel>
  )
}
