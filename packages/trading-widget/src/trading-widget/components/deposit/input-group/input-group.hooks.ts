import { TRADING_PANEL_LOG_EVENT } from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelLogger,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { useDepositPriceDiff } from 'core-kit/hooks/trading/deposit-v2'
import { useUserTokenBalance } from 'core-kit/hooks/user'

const useSendToken = () => {
  const [data, updater] = useSendTokenInput()
  const { chainId } = useTradingPanelPoolConfig()
  const price = useAssetPrice({ address: data.address, chainId })
  const balance = useUserTokenBalance({
    symbol: data.symbol,
    address: data.address,
  })

  return {
    ...data,
    price,
    balance,
    updater,
  }
}

const useReceiveToken = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()

  const price = usePoolTokenPrice({ address, chainId })

  return {
    ...receiveToken,
    price,
  }
}

export const useDepositInputGroup = () => {
  const sendToken = useSendToken()
  const receiveToken = useReceiveToken()
  const log = useTradingPanelLogger()
  const tradingPriceDiff = useDepositPriceDiff()
  const [{ minSlippage }] = useTradingPanelSettings()

  const handleInputChange = (value: string) => {
    sendToken.updater({ value })
  }

  const handleInputFocus = () => {
    log?.(TRADING_PANEL_LOG_EVENT.INVEST_INPUT_FOCUS, {
      symbol: sendToken.symbol,
      address: sendToken.address,
    })
  }

  return {
    autoFocus: false,
    sendToken,
    receiveToken,
    tradingPriceDiff,
    minSlippage,
    onInputFocus: handleInputFocus,
    onInputChange: handleInputChange,
  }
}
