import BigNumber from 'bignumber.js'

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
import {
  useIsInsufficientBalance,
  useUserTokenBalance,
} from 'core-kit/hooks/user'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import { OVERLAY } from 'trading-widget/types'

export const useHandleTrade = (trade: ContractActionFunc) => {
  const t = useTranslationContext()
  const dispatch = useOverlayDispatchContext()
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
  const sendTokenBalance = useUserTokenBalance({
    symbol: sendToken.symbol,
    address: sendToken.address,
  })
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
      meta: isDeposit
        ? {}
        : {
            withdrawPercentage:
              sendToken.value && sendTokenBalance
                ? new BigNumber(sendToken.value)
                    .div(sendTokenBalance)
                    .toNumber()
                : 0,
          },
    })

    try {
      await trade()
    } catch (error) {
      if (error instanceof EstimationError) {
        dispatch({
          type: 'MERGE_OVERLAY',
          payload: {
            type: OVERLAY.NOTIFICATION,
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
