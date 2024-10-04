import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { useUserTokenBalance } from 'core-kit/hooks/user'

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
