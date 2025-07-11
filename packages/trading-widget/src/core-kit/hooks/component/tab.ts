import { DEFAULT_PRECISION, MULTI_ASSET_TOKEN } from 'core-kit/const'
import { useHasSingleAssetWithdrawBlockers } from 'core-kit/hooks/pool/use-has-single-asset-withdraw-blockers'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { useVaultDepositTokens } from 'core-kit/hooks/trading/deposit-v2'
import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import type { TradingPanelType } from 'core-kit/types/trading-panel.types'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useOnTradingTypeChange = () => {
  const poolConfig = useTradingPanelPoolConfig()
  const [initialDepositToken] = useVaultDepositTokens()
  const { isAllAssetsWithdrawOptionDefault } = useConfigContextParams()
  const { data: completeWithdrawSwappableAsset = [] } =
    useCompleteWithdrawTrackedAssets()
  const isCompleteWithdrawStep = completeWithdrawSwappableAsset.length > 0
  const { data: hasSingleAssetWithdrawBlockers } =
    useHasSingleAssetWithdrawBlockers(poolConfig)

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
    const { customTokens, defaultWithdrawTokenSymbol } =
      poolConfig.withdrawParams

    const customWithdrawToken =
      customTokens.find(
        ({ symbol }) => symbol === defaultWithdrawTokenSymbol,
      ) ??
      customTokens[0] ??
      MULTI_ASSET_TOKEN

    const withdrawToken = isCompleteWithdrawStep
      ? customWithdrawToken
      : hasSingleAssetWithdrawBlockers || isAllAssetsWithdrawOptionDefault
        ? MULTI_ASSET_TOKEN
        : customWithdrawToken

    updateSendToken({
      address: poolConfig.address,
      symbol: poolConfig.symbol,
      decimals: DEFAULT_PRECISION,
      value: '',
    })
    updateReceiveToken({
      ...withdrawToken,
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
