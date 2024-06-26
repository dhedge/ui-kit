import { DEFAULT_PRECISION, MULTI_ASSET_TOKEN } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { usePoolDepositTokens } from 'core-kit/hooks/trading/deposit'
import type { TradingPanelType } from 'core-kit/types/trading-panel.types'

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
      ...(customWithdrawToken ?? MULTI_ASSET_TOKEN),
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
