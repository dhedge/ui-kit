import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { useSwapReceiveValueDiff } from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { useGetThemeTypeBySlippage } from 'trading-widget/hooks'

export const useInputGroup = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const price = useAssetPrice({ address: receiveToken.address, chainId })
  const swapDiff = useSwapReceiveValueDiff()
  const themeType = useGetThemeTypeBySlippage(swapDiff < 0 ? swapDiff : 0)

  return {
    receiveToken: {
      ...receiveToken,
      price,
    },
    swapDiff,
    themeType,
  }
}
