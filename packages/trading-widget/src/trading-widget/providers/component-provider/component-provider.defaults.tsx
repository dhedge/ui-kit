import { Alert } from 'trading-widget/components/common'

import type { ComponentProviderProps } from './component-provider.types'

export const DEFAULT_COMPONENT_PROVIDER_COMPONENTS: ComponentProviderProps['config'] =
  {
    GeoBlockAlert: () => (
      <Alert>
        <span className="dtw-text-sm dtw-text-error">
          Depositing is geo-blocked.
        </span>
      </Alert>
    ),
    SanctionedAlert: () => (
      <Alert>
        <span className="dtw-text-sm dtw-text-error">
          Your address has been found on a sanctions list. Deposits are
          disabled.
        </span>
      </Alert>
    ),
  }
