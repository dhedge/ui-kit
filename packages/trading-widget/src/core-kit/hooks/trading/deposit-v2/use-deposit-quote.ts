import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import { DEPOSIT_QUOTE_MULTIPLIER_DEFAULT } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'
import type { PoolConfig } from 'core-kit/types/config.types'

import { useDepositQuoteContractRead } from './use-deposit-quote-contract-read'

export const useDepositQuote = ({
  address,
  chainId,
}: Pick<PoolConfig, 'address' | 'chainId' | 'depositParams'>) => {
  const [sendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const [, updateSettings] = useTradingPanelSettings()
  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)

  const { data: quoteResult, isFetching } = useDepositQuoteContractRead({
    address,
    chainId,
  })

  const isLoading = isFetching || sendToken.value !== debouncedSendTokenValue

  // Updates received amount for EasySwapper deposits
  useEffect(() => {
    updateReceiveToken({ isLoading })
    if (quoteResult) {
      const formattedVal = new BigNumber(quoteResult.toString())
        .multipliedBy(DEPOSIT_QUOTE_MULTIPLIER_DEFAULT)
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
  ])

  useEffect(() => {
    if (!sendToken.value) {
      updateReceiveToken({ value: '0' })
      updateSettings({ minSlippage: 0 })
    }
  }, [updateReceiveToken, updateSettings, sendToken.value])
}
