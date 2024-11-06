import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
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

export const useInitWithdrawInputGroup = () => {
  const isMultiAssetWithdraw = useIsMultiAssetWithdraw()
  const sendToken = useSendToken()

  const handleInputChange = (value: string) => {
    sendToken.updater({ value })
  }

  return {
    sendToken,
    onInputChange: handleInputChange,
    isMultiAssetWithdraw,
  }
}
