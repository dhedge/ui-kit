import {
  useOnTransactionEstimationError,
  useSendTokenInput,
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import { OVERLAY } from 'trading-widget/types'

interface UseHandleLimitOrderWithdrawProps {
  limitOrderHandler: ContractActionFunc
  action: 'limit_order_withdraw' | 'delete_limit_order_withdraw'
}

export const useHandleLimitOrderWithdraw = ({
  limitOrderHandler,
  action,
}: UseHandleLimitOrderWithdrawProps) => {
  const t = useTranslationContext()
  const dispatch = useOverlayDispatchContext()
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const updateTradingModal = useTradingPanelModal()[1]
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onTransactionEstimationError = useOnTransactionEstimationError()
  const isDeleteAction = action === 'delete_limit_order_withdraw'

  const handleLimitOrderWithdraw = async () => {
    const chainId = poolConfig.chainId

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action,
      link: '',
      sendTokens: isDeleteAction ? [] : [sendToken],
      receiveTokens: null,
      meta: {},
    })

    try {
      await limitOrderHandler()
    } catch (error) {
      if (error instanceof EstimationError) {
        dispatch({
          type: 'MERGE_OVERLAY',
          payload: {
            type: OVERLAY.ERROR_NOTIFICATION,
            isOpen: true,
            meta: {
              error: error.message,
            },
          },
        })

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
        meta: {},
      })
      updatePendingTransactions({ type: 'remove', status: 'fail' })
    }
  }

  return {
    label: isDeleteAction ? t.delete : t.withdrawAction,
    handleLimitOrderWithdraw,
  }
}
