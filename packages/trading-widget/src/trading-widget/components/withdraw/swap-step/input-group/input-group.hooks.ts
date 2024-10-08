import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'

export const useInputGroup = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const price = useAssetPrice({ address: receiveToken.address, chainId })

  return {
    receiveToken: {
      ...receiveToken,
      price,
    },
  }
}
