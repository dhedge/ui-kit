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
    form: { stopLossPrice, takeProfitPrice, termsAccepted },
    pricingAsset,
    pendingTransaction,
    isReversedOrder,
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
  const vaultPrice = usePoolTokenPrice({ address: vaultAddress })
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
    const stopLossPriceD18 = stopLossPrice
      ? BigInt(shiftBy(stopLossPrice, DEFAULT_PRECISION))
      : BigInt(0)
    const takeProfitPriceD18 = takeProfitPrice
      ? BigInt(shiftBy(takeProfitPrice, DEFAULT_PRECISION))
      : MaxUint256

    const args = [
      amount,
      stopLossPriceD18,
      takeProfitPriceD18,
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
      isReversedOrder: isReversedOrder,
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
