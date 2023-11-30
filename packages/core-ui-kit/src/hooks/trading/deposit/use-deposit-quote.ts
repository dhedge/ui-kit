import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import { DhedgeEasySwapperAbi } from 'abi'
import {
  DEPOSIT_QUOTE_MULTIPLIER_CUSTOM,
  DEPOSIT_QUOTE_MULTIPLIER_DEFAULT,
} from 'const'
import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelSettings,
} from 'hooks/state'
import { usePoolDepositAssetAddress } from 'hooks/trading/deposit'
import { useDebounce } from 'hooks/utils'
import { useContractReads, useContractReadsErrorLogging } from 'hooks/web3'
import type { PoolConfig } from 'types/config.types'
import { getContractAddressById } from 'utils'

export const useDepositQuote = ({
  address,
  chainId,
  depositParams,
}: Pick<PoolConfig, 'address' | 'chainId' | 'depositParams'>) => {
  const [sendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const [, updateSettings] = useTradingPanelSettings()
  const isDeposit = useIsDepositTradingPanelType()

  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)
  const poolDepositAssetAddress = usePoolDepositAssetAddress({
    investAssetAddress: sendToken.address,
    symbol: sendToken.symbol,
    productPoolAddress: address,
    chainId,
  })

  const isSendValueUpdating = sendToken.value !== debouncedSendTokenValue
  const hasSendInputValue = !!(
    debouncedSendTokenValue && +debouncedSendTokenValue > 0
  )
  const sendAmount = new BigNumber(debouncedSendTokenValue || 0)
    .shiftedBy(sendToken.decimals)
    .toFixed(0)

  const { data } = useContractReads({
    contracts: [
      {
        address: getContractAddressById('easySwapper', chainId),
        abi: DhedgeEasySwapperAbi,
        functionName: 'depositQuote',
        args: [
          address,
          sendToken.address,
          BigInt(sendAmount),
          poolDepositAssetAddress,
          depositParams.method === 'depositWithCustomCooldown',
        ],
        chainId,
      },
    ],
    enabled:
      hasSendInputValue && !!sendToken.address && !!poolDepositAssetAddress,
    watch: true,
  })
  const depositQuote = data?.[0]?.result
  useContractReadsErrorLogging(data)

  useEffect(() => {
    if (!isDeposit) return // Fixes useEffect call on trading tabs switch

    const isLoading =
      isSendValueUpdating || (!depositQuote && hasSendInputValue)

    updateReceiveToken({ isLoading })
    if (depositQuote) {
      const formattedVal = new BigNumber(depositQuote.toString())
        .multipliedBy(
          sendToken.address === poolDepositAssetAddress
            ? DEPOSIT_QUOTE_MULTIPLIER_DEFAULT
            : DEPOSIT_QUOTE_MULTIPLIER_CUSTOM,
        )
        .shiftedBy(-receiveToken.decimals)
        .toFixed(receiveToken.decimals)

      updateReceiveToken({ value: isLoading ? '0' : formattedVal })
    }
  }, [
    isDeposit,
    receiveToken.decimals,
    hasSendInputValue,
    depositQuote,
    sendToken.address,
    poolDepositAssetAddress,
    isSendValueUpdating,
    updateReceiveToken,
  ])

  useEffect(() => {
    if (!sendToken.value) {
      updateReceiveToken({ value: '0' })
      updateSettings({ minSlippage: 0 })
    }
  }, [updateReceiveToken, updateSettings, sendToken.value])
}
