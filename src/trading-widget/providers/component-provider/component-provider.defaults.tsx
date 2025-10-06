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
        <p className="dtw-text-center">
          {liquidityAmount
            ? `${liquidityAmount} withdrawal liquidity`
            : 'Liquidity is running low'}
        </p>
        <p className="dtw-text-sm dtw-text-center">Sell a smaller amount</p>
      </Alert>
    ),
    MaxSupplyReachedAlert: () => (
      <Alert type="error">
        <p className="dtw-text-center dtw-text-base">Max supply reached</p>
        <p className="dtw-text-sm dtw-text-center">
          Deposit at this size will not go through
        </p>
      </Alert>
    ),
  }
