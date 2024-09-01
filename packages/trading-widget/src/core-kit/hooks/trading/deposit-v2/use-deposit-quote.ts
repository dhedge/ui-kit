import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'

import { useDepositQuoteContractRead } from './use-deposit-quote-contract-read'
import { useSwapDataBasedOnSendToken } from './use-swap-data-based-on-send-token'

export const useDepositQuote = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const isDeposit = useIsDepositTradingPanelType()

  const [sendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const [, updateSettings] = useTradingPanelSettings()
  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)
  const { isFetching: isSwapDataFetching } = useSwapDataBasedOnSendToken()
  const { data: quoteResult, isFetching: isDepositQuoteFetching } =
    useDepositQuoteContractRead({
      address,
      chainId,
    })

  const isLoading =
    isSwapDataFetching ||
    isDepositQuoteFetching ||
    sendToken.value !== debouncedSendTokenValue

  useEffect(() => {
    if (!isDeposit) {
      return
    }
    if (quoteResult) {
      const formattedVal = new BigNumber(quoteResult.toString())
        .shiftedBy(-receiveToken.decimals)
        .toFixed(receiveToken.decimals)

      updateReceiveToken({ value: formattedVal })
    }
  }, [
    quoteResult,
    receiveToken.decimals,
    sendToken.address,
    updateReceiveToken,
    isDeposit,
  ])

  useEffect(() => {
    if (!isDeposit) {
      return
    }
    updateReceiveToken({ isLoading })
  }, [isDeposit, isLoading, updateReceiveToken])

  useEffect(() => {
    if (!isDeposit) {
      return
    }
    if (!sendToken.value || sendToken.value === '0') {
      updateReceiveToken({ value: '0' })
      updateSettings({ minSlippage: 0 })
    }
  }, [updateReceiveToken, updateSettings, sendToken.value, isDeposit])
}
