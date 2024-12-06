import { useCallback } from 'react'
import { injected } from 'wagmi/connectors'

import {
  DEFAULT_LOCK_TIME,
  DEFAULT_NOTIFICATION_DURATION_MS,
  DEFAULT_NO_SWAP_MIN_DEPOSIT_AMOUNT_GAP,
  DEFAULT_SWAP_TRANSACTION_SLIPPAGE,
  DEFAULT_WITHDRAW_SLIPPAGE,
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
  defaultWithdrawSlippage: DEFAULT_WITHDRAW_SLIPPAGE,
  defaultLockTime: DEFAULT_LOCK_TIME,
  defaultNoSwapMinDepositAmountGap: DEFAULT_NO_SWAP_MIN_DEPOSIT_AMOUNT_GAP,
  defaultSwapTransactionSlippage: DEFAULT_SWAP_TRANSACTION_SLIPPAGE,
  defaultNotificationDuration: DEFAULT_NOTIFICATION_DURATION_MS,
  stablePrecision: 3,
  defaultPrecision: 6,
  stakingChainId: optimism.id,
  termsOfUseAccepted: true,
  standalone: true,
  isAllAssetsWithdrawOptionDefault: false,
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
  aaveOffchainWithdrawChainIds: [polygon.id],
  aaveOffchainWithdrawMinValue: 50,
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
