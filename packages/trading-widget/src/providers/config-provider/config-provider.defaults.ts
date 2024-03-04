import {
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_DEPOSIT_SLIPPAGE_SCALE,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
  optimism,
} from '@dhedge/core-ui-kit/const'
import { useConnect } from '@dhedge/core-ui-kit/hooks/web3'
import { formatDuration } from 'date-fns'
import { useCallback } from 'react'
import { injected } from 'wagmi/connectors'

import type {
  ConfigProviderActions,
  ConfigProviderParams,
} from './config-provider.types'

export const DEFAULT_CONFIG_PARAMS: ConfigProviderParams = {
  isGeoBlocked: false,
  depositQuoteDiffWarningThreshold: 1,
  depositQuoteDiffErrorThreshold: 3,
  defaultDepositSlippage: DEFAULT_DEPOSIT_SLIPPAGE,
  defaultDepositSlippageScale: DEFAULT_DEPOSIT_SLIPPAGE_SCALE,
  defaultWithdrawSlippageScale: DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
  defaultLockTime: formatDuration({ hours: 24 }),
  customLockTime: formatDuration({ minutes: 15 }),
  stablePrecision: 3,
  defaultPrecision: 6,
  stakingChainId: optimism.id,
}

export const useConfigProviderDefaultActions = (): ConfigProviderActions => {
  const { connect } = useConnect()

  const onConnect = useCallback(
    () => connect({ connector: injected({ shimDisconnect: true }) }),
    [connect],
  )

  return {
    onConnect,
  }
}
