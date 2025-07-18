import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

import { useSendTokenDebouncedValue } from 'core-kit/hooks/trading'
import { useDepositQuoteContractRead } from 'core-kit/hooks/trading/deposit-v2/use-deposit-quote-contract-read'
import { useSwapDataBasedOnSendToken } from 'core-kit/hooks/trading/deposit-v2/use-swap-data-based-on-send-token'

export const useDepositQuote = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const isDeposit = useIsDepositTradingPanelType()

  const [sendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const [, updateSettings] = useTradingPanelSettings()
  const { isDebouncing, debouncedSendTokenValue } = useSendTokenDebouncedValue()

  const { isFetching: isSwapDataFetching } = useSwapDataBasedOnSendToken()
  const { data: quoteResult, isFetching: isDepositQuoteFetching } =
    useDepositQuoteContractRead({
      address,
      chainId,
    })

  const isLoading = isSwapDataFetching || isDepositQuoteFetching || isDebouncing

  useEffect(() => {
    if (!isDeposit || isLoading) {
      return
    }
    const formattedVal = quoteResult
      ? new BigNumber(quoteResult.toString())
          .shiftedBy(-receiveToken.decimals)
          .toFixed(receiveToken.decimals)
      : ''

    updateReceiveToken({ value: formattedVal })
  }, [
    quoteResult,
    receiveToken.decimals,
    sendToken.address,
    updateReceiveToken,
    isDeposit,
    isLoading,
    debouncedSendTokenValue, // add debouncedSendTokenValue in order to update receive token value with same quote for the second time
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
