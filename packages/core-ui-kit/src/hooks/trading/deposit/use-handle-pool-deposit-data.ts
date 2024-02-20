import { useEffect } from 'react'

import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelType,
} from 'hooks/state'

import { usePoolDepositTokens } from './use-pool-deposit-tokens'

export const useHandlePoolDepositData = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const [initialDepositToken] = usePoolDepositTokens()
  const updateSendToken = useSendTokenInput()[1]
  const [type] = useTradingPanelType()

  useEffect(() => {
    if (type === 'deposit' && initialDepositToken?.symbol) {
      updateSendToken({
        address: initialDepositToken?.address,
        symbol: initialDepositToken.symbol,
        decimals: initialDepositToken?.decimals,
        value: '',
        isLoading: !initialDepositToken.symbol,
      })
    }
    // add poolConfig.address to deps array in order to update send token on pool address change
  }, [
    updateSendToken,
    poolConfig.address,
    type,
    initialDepositToken?.symbol,
    initialDepositToken?.address,
    initialDepositToken?.decimals,
  ])
}
