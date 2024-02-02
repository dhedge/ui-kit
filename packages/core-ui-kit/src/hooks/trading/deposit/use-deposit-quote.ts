import BigNumber from 'bignumber.js'

import { useEffect } from 'react'

import { DhedgeEasySwapperAbi } from 'abi'
import {
  DEPOSIT_QUOTE_MULTIPLIER_CUSTOM,
  DEPOSIT_QUOTE_MULTIPLIER_DEFAULT,
  DEPOSIT_QUOTE_POOL_LOGIC_MULTIPLIER,
} from 'const'
import { usePoolTokenPrice } from 'hooks/pool'
import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelSettings,
} from 'hooks/state'
import { usePoolDepositAssetAddress } from 'hooks/trading/deposit'
import { useDebounce } from 'hooks/utils'
import {
  useContractReadsErrorLogging,
  useInvalidateOnBlock,
  useReadContracts,
} from 'hooks/web3'
import type { PoolConfig } from 'types/config.types'
import { getContractAddressById } from 'utils'

import { useAssetPrice } from '../use-asset-price'
import { useIsEasySwapperTrading } from '../use-is-easy-swapper-trading'

export const useDepositQuote = ({
  address,
  chainId,
  depositParams,
}: Pick<PoolConfig, 'address' | 'chainId' | 'depositParams'>) => {
  const [sendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const [, updateSettings] = useTradingPanelSettings()
  const isDeposit = useIsDepositTradingPanelType()
  const isEasySwapperTrading = useIsEasySwapperTrading()
  const vaultTokenPrice = usePoolTokenPrice({
    address: receiveToken.address,
    chainId,
    disabled: isEasySwapperTrading,
  })
  const sendTokenPrice = useAssetPrice({
    address: sendToken.address,
    chainId,
    disabled: isEasySwapperTrading,
  })
  const debounceTime = isEasySwapperTrading ? 500 : 0
  const debouncedSendTokenValue = useDebounce(sendToken.value, debounceTime)
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
  const sendAmount = new BigNumber(debouncedSendTokenValue || '0')
    .shiftedBy(sendToken.decimals)
    .toFixed(0)

  const { data, queryKey } = useReadContracts({
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
    query: {
      enabled:
        hasSendInputValue &&
        !!sendToken.address &&
        !!poolDepositAssetAddress &&
        isEasySwapperTrading,
    },
  })

  useInvalidateOnBlock({ queryKey })

  const depositQuote = data?.[0]?.result
  useContractReadsErrorLogging(data)

  // Updates received amount for EasySwapper deposits
  useEffect(() => {
    if (!isDeposit || !isEasySwapperTrading) {
      return
    }

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
    isEasySwapperTrading,
    isDeposit,
    receiveToken.decimals,
    hasSendInputValue,
    depositQuote,
    sendToken.address,
    poolDepositAssetAddress,
    isSendValueUpdating,
    updateReceiveToken,
  ])

  // Updates received amount for PoolLogic deposits
  useEffect(() => {
    if (!isDeposit || isEasySwapperTrading || !hasSendInputValue) {
      return
    }
    updateReceiveToken({
      value: new BigNumber(sendAmount)
        .shiftedBy(-sendToken.decimals)
        .multipliedBy(sendTokenPrice)
        .dividedBy(vaultTokenPrice)
        .multipliedBy(DEPOSIT_QUOTE_POOL_LOGIC_MULTIPLIER)
        .toFixed(receiveToken.decimals),
    })
  }, [
    isDeposit,
    isEasySwapperTrading,
    sendAmount,
    sendTokenPrice,
    updateReceiveToken,
    vaultTokenPrice,
    sendToken.decimals,
    receiveToken.decimals,
    hasSendInputValue,
  ])

  useEffect(() => {
    if (!sendToken.value) {
      updateReceiveToken({ value: '0' })
      updateSettings({ minSlippage: 0 })
    }
  }, [updateReceiveToken, updateSettings, sendToken.value])
}
