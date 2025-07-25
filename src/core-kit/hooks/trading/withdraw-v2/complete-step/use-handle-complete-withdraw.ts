import {
  useOnTransactionEstimationError,
  useReceiveTokenInput,
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import {
  useCompleteWithdrawSwapData,
  useCompleteWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { isEqualAddress } from 'core-kit/utils'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import { OVERLAY } from 'trading-widget/types'

interface UseHandleWithdrawSwapProps {
  withdraw: ContractActionFunc
  isClaim?: boolean
}

export const useHandleCompleteWithdraw = ({
  withdraw,
  isClaim,
}: UseHandleWithdrawSwapProps) => {
  const t = useTranslationContext()
  const dispatch = useOverlayDispatchContext()

  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const updateTradingModal = useTradingPanelModal()[1]
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onTransactionEstimationError = useOnTransactionEstimationError()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  const { isFetching: isSwapDataFetching } = useCompleteWithdrawSwapData()

  const handleTrade = async () => {
    const chainId = poolConfig.chainId
    const withdrawalContractTokens = assets.map(
      ({ address, decimals, symbol, balance }) => ({
        address,
        decimals,
        symbol,
        value: balance.toString(),
      }),
    )
    const sendTokens = isClaim
      ? null
      : withdrawalContractTokens.filter(
          (token) => !isEqualAddress(token.address, receiveToken.address),
        )

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action: isClaim ? 'claim' : 'swap',
      link: '',
      sendTokens,
      receiveTokens: isClaim ? withdrawalContractTokens : [receiveToken],
    })

    try {
      await withdraw()
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
      })
      updatePendingTransactions({ type: 'remove', status: 'fail' })
    }
  }

  return {
    disabled: isClaim ? false : isSwapDataFetching,
    label: isClaim ? t.claimAction : t.swapAction,
    handleTrade,
  }
}
