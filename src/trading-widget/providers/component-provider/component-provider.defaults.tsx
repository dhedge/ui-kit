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
    MaxSupplyReachedAlert: ({ supplyCapInUsd }) => (
      <Alert type="warning">
        <p className="dtw-text-center dtw-text-base">Supply caps reached</p>
        <p className="dtw-text-sm dtw-text-center">
          Can only buy {supplyCapInUsd} more
        </p>
      </Alert>
    ),
    OnDemandWithdrawAlert: () => (
      <Alert type="info">
        <p className="dtw-text-center">On demand sell</p>
        <p className="dtw-text-sm dtw-text-[color:var(--panel-secondary-content-color)] dtw-text-center">
          Sell will happen automatically over time as liquidity is made
          available
        </p>
      </Alert>
    ),
  }
