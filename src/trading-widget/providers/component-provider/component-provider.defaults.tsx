import { Alert } from 'trading-widget/components/common'

import type { ComponentProviderProps } from 'trading-widget/providers/component-provider/component-provider.types'

export const DEFAULT_COMPONENT_PROVIDER_COMPONENTS: ComponentProviderProps['config'] =
  {
    GeoBlockAlert: () => (
      <Alert type="error">
        <span className="dtw-text-sm">Depositing is geo-blocked.</span>
      </Alert>
    ),
    SanctionedAlert: () => (
      <Alert type="error">
        <span className="dtw-text-sm">
          Your address has been found on a sanctions list. Deposits are
          disabled.
        </span>
      </Alert>
    ),
    AvailableLiquidityAlert: ({ liquidityAmount }) => (
      <Alert type="warning">
        <p>
          Liquidity is running low{' '}
          {liquidityAmount ? `(${liquidityAmount})` : null}
        </p>
        <p className="dtw-text-sm">
          There is not enough capital to withdraw instantly
        </p>
      </Alert>
    ),
  }
