import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelType,
} from 'hooks/state'
import { useEffect } from 'react'

import { usePoolDepositTokens } from './use-pool-deposit-tokens'

export const useHandlePoolDepositData = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const [initialDepositToken] = usePoolDepositTokens()
  const updateSendToken = useSendTokenInput()[1]
  const [type] = useTradingPanelType()

  useEffect(() => {
    if (type === 'deposit') {
      updateSendToken({
        ...initialDepositToken,
        value: '',
        isLoading: !initialDepositToken,
      })
    }
    // add poolConfig.address to deps array in order to update send token on pool address change
  }, [initialDepositToken, updateSendToken, poolConfig.address, type])
}
