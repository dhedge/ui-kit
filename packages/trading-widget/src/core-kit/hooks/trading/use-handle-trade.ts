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
import {
  useIsMultiAssetWithdraw,
  useIsUnrollAndClaimTransaction,
} from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { useIsInsufficientBalance } from 'core-kit/hooks/user'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const useHandleTrade = (trade: ContractActionFunc) => {
  const t = useTranslationContext()
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const [type] = useTradingPanelType()
  const updateTradingModal = useTradingPanelModal()[1]
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onTransactionEstimationError = useOnTransactionEstimationError()
  const isMultiAssetWithdraw = useIsMultiAssetWithdraw()
  const isUnrollAndClaimTransaction = useIsUnrollAndClaimTransaction()
  const isDeposit = type === 'deposit'

  const tradingEnabled = useIsTradingEnabled()
  const insufficientBalance = useIsInsufficientBalance()

  const action = isDeposit
    ? 'deposit'
    : isMultiAssetWithdraw
      ? 'multi_withdraw'
      : isUnrollAndClaimTransaction
        ? 'single_withdraw_and_claim'
        : 'single_withdraw'

  const handleTrade = async () => {
    const chainId = poolConfig.chainId

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action,
      link: '',
      sendTokens: [sendToken],
      receiveTokens:
        isDeposit || isUnrollAndClaimTransaction ? [receiveToken] : null,
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
        receiveTokens: null,
      })
      updatePendingTransactions({ type: 'remove', status: 'fail' })
    }
  }

  return {
    disabled: !tradingEnabled || insufficientBalance,
    label: insufficientBalance
      ? 'Insufficient Balance'
      : isDeposit
        ? t.depositAction
        : isMultiAssetWithdraw
          ? t.withdrawAction
          : isUnrollAndClaimTransaction
            ? t.unrollAndClaimAction
            : t.unrollAction,
    handleTrade,
  }
}
