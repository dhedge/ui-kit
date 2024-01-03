import { DEFAULT_PRECISION, MULTI_ASSET_TOKEN } from 'const'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelType,
} from 'hooks/state'
import { usePoolDepositTokens } from 'hooks/trading/deposit'
import type { TradingPanelType } from 'types/trading-panel.types'

import { isSynthetixV3Vault } from 'utils'

export const useOnTradingTypeChange = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const [initialDepositToken] = usePoolDepositTokens()

  const setTradingType = useTradingPanelType()[1]
  const updateSendToken = useSendTokenInput()[1]
  const updateReceiveToken = useReceiveTokenInput()[1]

  const onDepositSwitch = () => {
    updateSendToken({
      ...initialDepositToken,
      value: '',
      isLoading: !initialDepositToken,
    })
    updateReceiveToken({
      address: poolConfig.address,
      symbol: poolConfig.symbol,
      decimals: DEFAULT_PRECISION,
      value: '',
    })
  }

  const onWithdrawSwitch = () => {
    const [customWithdrawToken] = poolConfig.withdrawParams.customTokens
    updateSendToken({
      address: poolConfig.address,
      symbol: poolConfig.symbol,
      decimals: DEFAULT_PRECISION,
      value: '',
    })
    // Set "All assets" as default withdraw option in Synthetix V3 vaults
    updateReceiveToken({
      ...(isSynthetixV3Vault(poolConfig.address)
        ? MULTI_ASSET_TOKEN
        : customWithdrawToken),
      value: '',
      isLoading: false,
    })
  }

  return (type: TradingPanelType) => {
    setTradingType(type)

    switch (type) {
      case 'deposit':
        return onDepositSwitch()
      case 'withdraw':
        return onWithdrawSwitch()
    }
  }
}
