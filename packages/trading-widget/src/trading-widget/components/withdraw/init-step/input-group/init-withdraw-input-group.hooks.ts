import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { useUserTokenBalance } from 'core-kit/hooks/user'

const useSendToken = () => {
  const { address } = useTradingPanelPoolConfig()
  const [data, updater] = useSendTokenInput()
  const balance = useUserTokenBalance({
    symbol: data.symbol,
    address: data.address,
  })
  const price = usePoolTokenPrice({ address })

  return {
    ...data,
    updater,
    balance,
    price,
  }
}

const useReceiveToken = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [data, updater] = useReceiveTokenInput()
  const price = useAssetPrice({ address: data.address, chainId })

  return {
    ...data,
    updater,
    price,
  }
}

export const useInitWithdrawInputGroup = () => {
  const sendToken = useSendToken()
  const receiveToken = useReceiveToken()

  const handleInputChange = (value: string) => {
    sendToken.updater({ value })
  }

  return {
    sendToken,
    onInputChange: handleInputChange,
    receiveToken,
  }
}
