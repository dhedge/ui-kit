import { useCallback } from 'react'
import { injected } from 'wagmi/connectors'

import {
  CUSTOM_LOCK_TIME,
  DEFAULT_LOCK_TIME,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
  arbitrum,
  base,
  optimism,
  polygon,
} from 'core-kit/const'
import { useConnect } from 'core-kit/hooks/web3'

import type {
  ConfigProviderActions,
  ConfigProviderParams,
} from './config-provider.types'

export const DEFAULT_CONFIG_PARAMS: ConfigProviderParams = {
  isGeoBlocked: false,
  isSanctioned: false,
  depositQuoteDiffWarningThreshold: 1,
  depositQuoteDiffErrorThreshold: 3,
  defaultWithdrawSlippageScale: DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
  defaultLockTime: DEFAULT_LOCK_TIME,
  chainCustomLockTimeMap: {
    [arbitrum.id]: CUSTOM_LOCK_TIME,
    [optimism.id]: CUSTOM_LOCK_TIME,
    [polygon.id]: CUSTOM_LOCK_TIME,
    [base.id]: CUSTOM_LOCK_TIME,
  },
  stablePrecision: 3,
  defaultPrecision: 6,
  stakingChainId: optimism.id,
  termsOfUseAccepted: true,
  standalone: true,
  chainConfig: {
    [arbitrum.id]: {
      name: 'Arbitrum',
      iconPath: '',
    },
    [optimism.id]: {
      name: 'Optimism',
      iconPath: '',
    },
    [polygon.id]: {
      name: 'Polygon',
      iconPath: '',
    },
    [base.id]: {
      name: 'Base',
      iconPath: '',
    },
  },
}

export const useConfigProviderDefaultActions = (): ConfigProviderActions => {
  const { connect } = useConnect()

  const onConnect = useCallback(
    () => connect({ connector: injected({ shimDisconnect: true }) }),
    [connect],
  )

  const onAcceptTermsOfUse = useCallback(async () => {
    console.log(
      'terms of use were accepted. Assume `termsOfUseAccepted` config value switch to true',
    )
    return Promise.resolve(true)
  }, [])

  return {
    onConnect,
    onAcceptTermsOfUse,
  }
}
