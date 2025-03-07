import { AddressZero } from 'core-kit/const'
import { useAccount } from 'core-kit/hooks/web3'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'
import { useUserLimitOrder } from 'limit-orders/hooks/useUserLimitOrder'

export const useInputGroup = () => {
  const { account = AddressZero } = useAccount()
  const {
    takeProfitPrice,
    stopLossPrice,
    vaultAddress,
    vaultChainId,
    termsAccepted,
  } = useLimitOrderState()
  const { setTakeProfitPrice, setStopLossPrice, setTermsAccepted } =
    useLimitOrderActions()
  const { data } = useUserLimitOrder({
    vaultAddress,
    chainId: vaultChainId,
    userAddress: account,
  })

  return {
    takeProfitPrice,
    stopLossPrice,
    setTakeProfitPrice,
    setStopLossPrice,
    profitPricePlaceholder: data?.takeProfitPrice ?? '',
    lossPricePlaceholder: data?.stopLossPrice ?? '',
    termsAccepted,
    setTermsAccepted,
  }
}
