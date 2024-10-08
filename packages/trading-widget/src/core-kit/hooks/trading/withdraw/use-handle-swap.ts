import {
  useOnTransactionEstimationError,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'

export const useHandleSwap = (trade: ContractActionFunc) => {
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const updateTradingModal = useTradingPanelModal()[1]
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onTransactionEstimationError = useOnTransactionEstimationError()

  const handleTrade = async () => {
    const chainId = poolConfig.chainId

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action: 'withdraw',
      link: '',
      sendToken,
      receiveToken,
    })

    try {
      await trade()
    } catch (error) {
      if (error instanceof EstimationError) {
        onTransactionEstimationError?.(
          error,
          poolConfig.address,
          chainId,
          account,
        )
      }
      updateTradingModal({
        isOpen: false,
        status: 'None',
        link: '',
        sendToken: null,
        receiveToken: null,
      })
      updatePendingTransactions({ type: 'remove', status: 'fail' })
    }
  }

  return {
    disabled: false,
    label: 'Swap',
    handleTrade,
  }
}
