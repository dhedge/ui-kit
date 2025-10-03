import { useCallback } from 'react'

import { AddressZero, MaxUint256 } from 'core-kit/const'
import {
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useLimitOrderWithdrawAmount } from 'core-kit/hooks/trading/limit-order-withdraw/use-limit-order-withdraw-amount'
import { useAccount, useContractFunction } from 'core-kit/hooks/web3'
import type { UseWriteContractParameters } from 'core-kit/types/web3.types'
import { useUserLimitOrder } from 'limit-orders/hooks/use-user-limit-order'

const action = 'limit_order_withdraw'

export const useLimitOrderWithdrawTransaction = (txCallback: () => void) => {
  const { account = AddressZero } = useAccount()
  const {
    address: vaultAddress,
    chainId,
    pricingAsset,
    symbol,
  } = useTradingPanelPoolConfig()
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onTransactionSettle = useTradingSettleHandler(action)

  const onSettled = useCallback<
    Required<Required<UseWriteContractParameters>['mutation']>['onSettled']
  >(
    (...args) => {
      onTransactionSettle(...args)
      txCallback()
    },
    [onTransactionSettle, txCallback],
  )

  const vaultAmount = useLimitOrderWithdrawAmount()

  const { data: limitOrder } = useUserLimitOrder({
    userAddress: account,
    vaultAddress,
    chainId,
  })
  const isModifyTransaction = !!limitOrder
  const { send } = useContractFunction({
    onSettled,
    contractId: 'limitOrder',
    functionName: isModifyTransaction ? 'modifyLimitOrder' : 'createLimitOrder',
  })

  return useCallback(async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol,
      chainId,
    })

    const lowerLimitPriceD18 = BigInt(0)
    const upperLimitPriceD18 = MaxUint256

    const args = [
      BigInt(vaultAmount.toFixed()),
      lowerLimitPriceD18,
      upperLimitPriceD18,
      account,
      vaultAddress,
      pricingAsset?.address,
    ]

    return send(args)
  }, [
    updatePendingTransactions,
    symbol,
    chainId,
    vaultAmount,
    account,
    vaultAddress,
    pricingAsset?.address,
    send,
  ])
}
