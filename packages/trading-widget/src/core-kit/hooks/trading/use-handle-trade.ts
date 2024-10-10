import {
  useOnTransactionEstimationError,
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { useIsTradingEnabled } from 'core-kit/hooks/trading'
import { useIsInsufficientBalance } from 'core-kit/hooks/user'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'

export const useHandleTrade = (trade: ContractActionFunc) => {
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const [type] = useTradingPanelType()
  const updateTradingModal = useTradingPanelModal()[1]
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onTransactionEstimationError = useOnTransactionEstimationError()

  const tradingEnabled = useIsTradingEnabled()
  const insufficientBalance = useIsInsufficientBalance()

  const handleTrade = async () => {
    const isDeposit = type === 'deposit'
    const chainId = poolConfig.chainId

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action: isDeposit ? 'deposit' : 'withdraw',
      link: '',
      sendTokens: [sendToken],
      receiveToken: isDeposit ? receiveToken : null,
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
        sendTokens: null,
        receiveToken: null,
      })
      updatePendingTransactions({ type: 'remove', status: 'fail' })
    }
  }

  return {
    disabled: !tradingEnabled || insufficientBalance,
    label: insufficientBalance
      ? 'Insufficient Balance'
      : type === 'deposit'
        ? 'Buy'
        : 'Sell',
    handleTrade,
  }
}
