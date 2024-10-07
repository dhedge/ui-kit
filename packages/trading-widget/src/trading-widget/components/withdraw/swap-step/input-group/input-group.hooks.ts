import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'

export const useInputGroup = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const price = useAssetPrice({ address: receiveToken.address, chainId })

  const handleInputChange = (value: string) => {
    updateReceiveToken({ value })
  }

  return {
    receiveToken: {
      ...receiveToken,
      price,
    },
    onInputChange: handleInputChange,

  }
}
