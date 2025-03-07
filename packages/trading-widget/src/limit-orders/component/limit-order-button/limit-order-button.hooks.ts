import type { Address } from 'viem'

import { AddressZero, DEFAULT_PRECISION, MaxUint256 } from 'core-kit/const'
import {
  useAccount,
  useBalance,
  useContractFunction,
} from 'core-kit/hooks/web3'
import { shiftBy } from 'core-kit/utils'
import { useLimitOrderState } from 'limit-orders/hooks/state'

export const useLimitOrderButton = () => {
  const { account = AddressZero } = useAccount()
  const {
    vaultAddress,
    vaultChainId,
    stopLossPrice,
    takeProfitPrice,
    pricingAssetsMap,
    termsAccepted,
  } = useLimitOrderState()
  const { data: balance } = useBalance({
    address: account,
    token: vaultAddress,
    chainId: vaultChainId,
  })
  const { send } = useContractFunction({
    contractId: 'limitOrder',
    functionName: 'createLimitOrder',
  })
  const disabled = !termsAccepted

  const modifyLimitOrder = () => {
    const amount = balance?.value ?? BigInt(0)
    const stopLossPriceD18 = stopLossPrice
      ? shiftBy(stopLossPrice, DEFAULT_PRECISION)
      : BigInt(0)
    const takeProfitPriceD18 = takeProfitPrice
      ? shiftBy(takeProfitPrice, DEFAULT_PRECISION)
      : MaxUint256
    const pricingAsset = pricingAssetsMap[vaultAddress.toLowerCase() as Address]
    const args = [
      amount,
      stopLossPriceD18,
      takeProfitPriceD18,
      account,
      vaultAddress,
      pricingAsset,
    ]

    return send(args)
  }

  return { modifyLimitOrder, disabled }
}
