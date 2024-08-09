import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import {
  DEPOSIT_QUOTE_MULTIPLIER_CUSTOM,
  DEPOSIT_QUOTE_MULTIPLIER_DEFAULT,
} from 'core-kit/const'
import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'

import { useDepositQuoteContractRead } from './use-deposit-quote-contract-read'
import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'

export const useDepositQuote = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const isDeposit = useIsDepositTradingPanelType()

  const [sendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const [, updateSettings] = useTradingPanelSettings()
  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()
  const { data: quoteResult, isFetching } = useDepositQuoteContractRead({
    address,
    chainId,
  })

  const isLoading = isFetching || sendToken.value !== debouncedSendTokenValue

  useEffect(() => {
    if (!isDeposit) {
      return
    }
    updateReceiveToken({ isLoading })
    if (quoteResult) {
      const formattedVal = new BigNumber(quoteResult.toString())
        .multipliedBy(
          isDepositWithSwapTransaction
            ? DEPOSIT_QUOTE_MULTIPLIER_CUSTOM
            : DEPOSIT_QUOTE_MULTIPLIER_DEFAULT,
        )
        .shiftedBy(-receiveToken.decimals)
        .toFixed(receiveToken.decimals)

      updateReceiveToken({ value: isLoading ? '0' : formattedVal })
    }
  }, [
    quoteResult,
    isLoading,
    receiveToken.decimals,
    sendToken.address,
    updateReceiveToken,
    isDeposit,
    isDepositWithSwapTransaction,
  ])

  useEffect(() => {
    if (!sendToken.value && isDeposit) {
      updateReceiveToken({ value: '0' })
      updateSettings({ minSlippage: 0 })
    }
  }, [updateReceiveToken, updateSettings, sendToken.value, isDeposit])
}
