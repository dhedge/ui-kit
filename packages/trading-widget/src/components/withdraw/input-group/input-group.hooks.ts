import { useUserTokenBalance } from '@dhedge/core-ui-kit/hooks/user'
import { useAssetPrice } from '@dhedge/core-ui-kit/hooks/trading'
import { usePoolTokenPrice } from '@dhedge/core-ui-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from '@dhedge/core-ui-kit/hooks/state'

const useSendToken = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [data, updater] = useSendTokenInput()
  const balance = useUserTokenBalance({
    symbol: data.symbol,
    address: data.address,
  })
  const price = usePoolTokenPrice({ address, chainId })

  return {
    ...data,
    updater,
    balance,
    price,
  }
}

const useReceiveToken = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [data] = useReceiveTokenInput()
  const price = useAssetPrice({ address: data.address, chainId })

  return {
    ...data,
    price,
  }
}

export const useWithdrawInputGroup = () => {
  const sendToken = useSendToken()
  const receiveToken = useReceiveToken()
  const [{ minSlippage }] = useTradingPanelSettings()

  const handleInputChange = (value: string) => {
    sendToken.updater({ value })
  }

  return {
    sendToken,
    receiveToken,
    autoFocus: false,
    onInputChange: handleInputChange,
    minSlippage,
  }
}
