import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step'
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
  const [data, updater] = useReceiveTokenInput()
  const price = useAssetPrice({ address: data.address, chainId })

  return {
    ...data,
    updater,
    price,
  }
}

export const useInitWithdrawInputGroup = () => {
  const isMultiAssetWithdraw = useIsMultiAssetWithdraw()
  const sendToken = useSendToken()
  const receiveToken = useReceiveToken()

  const handleInputChange = (value: string) => {
    sendToken.updater({ value })
  }

  return {
    sendToken,
    onInputChange: handleInputChange,
    isMultiAssetWithdraw,
    receiveToken,
  }
}
