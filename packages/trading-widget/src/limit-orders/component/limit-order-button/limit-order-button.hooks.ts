import { BigNumber } from 'bignumber.js'
import { useState } from 'react'

import { LimitOrderAbi } from 'core-kit/abi'
import { AddressZero, DEFAULT_PRECISION, MaxUint256 } from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useAccount,
  useBalance,
  useContractFunction,
} from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import {
  formatEther,
  formatToUsd,
  parseContractErrorMessage,
  shiftBy,
} from 'core-kit/utils'
import { useLimitOrderState } from 'limit-orders/hooks/state'
import { useOnLimitOrderSettled } from 'limit-orders/hooks/use-on-limit-order-settled'
import { useUserLimitOrder } from 'limit-orders/hooks/use-user-limit-order'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'
import { adjustLimitOrderError } from 'limit-orders/utils'

const LIMIT_ORDER_ERRORS = LimitOrderAbi.filter(
  ({ type }) => type === 'error',
).map(({ name }) => name)

export const useLimitOrderButton = () => {
  const translationMap = useTranslationContext()
  const { account = AddressZero } = useAccount()
  const {
    vaultAddress,
    vaultChainId,
    form: { lowerLimitPrice, upperLimitPrice, termsAccepted },
    pricingAsset,
    pendingTransaction,
    minAmountInUsd,
  } = useLimitOrderState()
  const { data: limitOrder } = useUserLimitOrder({
    userAddress: account,
    vaultAddress,
    chainId: vaultChainId,
  })
  const { data: balance } = useBalance({
    address: account,
    token: vaultAddress,
    chainId: vaultChainId,
  })
  const vaultPrice = usePoolTokenPrice({
    address: vaultAddress,
    chainId: vaultChainId,
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const onSettled = useOnLimitOrderSettled()
  const { send } = useContractFunction({
    onSettled,
    contractId: 'limitOrder',
    functionName: limitOrder ? 'modifyLimitOrder' : 'createLimitOrder',
  })

  const vaultBalanceInUsd = new BigNumber(
    formatEther(balance?.value ?? BigInt(0)),
  ).multipliedBy(vaultPrice ?? '0')
  const isAmountSufficient = vaultBalanceInUsd.gte(minAmountInUsd)

  const disabled = !termsAccepted || !isAmountSufficient
  const isPending = !!pendingTransaction

  const modifyLimitOrder = async () => {
    const amount = balance?.value ?? BigInt(0)
    const lowerLimitPriceD18 = lowerLimitPrice
      ? BigInt(shiftBy(lowerLimitPrice, DEFAULT_PRECISION))
      : BigInt(0)
    const upperLimitPriceD18 = upperLimitPrice
      ? BigInt(shiftBy(upperLimitPrice, DEFAULT_PRECISION))
      : MaxUint256

    const args = [
      amount,
      lowerLimitPriceD18,
      upperLimitPriceD18,
      account,
      vaultAddress,
      pricingAsset.address,
    ]

    try {
      await send(args)
      setErrorMessage(null)
    } catch (error) {
      if (error instanceof EstimationError) {
        setErrorMessage(error.message)
      }
    }
  }

  return {
    modifyLimitOrder,
    disabled,
    error: adjustLimitOrderError({
      error: parseContractErrorMessage({
        errorMessage,
        abiErrors: LIMIT_ORDER_ERRORS,
      }),
      translationMap,
    }),
    isPending,
    isAmountSufficient,
    minAmount: formatToUsd({
      value: minAmountInUsd.toString(),
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }),
  }
}
