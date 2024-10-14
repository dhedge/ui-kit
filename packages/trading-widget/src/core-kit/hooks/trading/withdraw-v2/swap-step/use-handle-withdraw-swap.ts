import {
  useOnTransactionEstimationError,
  useReceiveTokenInput,
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import {
  useWithdrawSwapData,
  useWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { useAccount } from 'core-kit/hooks/web3'
import { EstimationError } from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface UseHandleWithdrawSwapProps {
  withdraw: ContractActionFunc
  skipSwap?: boolean
}

export const useHandleWithdrawSwap = ({
  withdraw,
  skipSwap,
}: UseHandleWithdrawSwapProps) => {
  const t = useTranslationContext()
  const { account } = useAccount()
  const poolConfig = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const updateTradingModal = useTradingPanelModal()[1]
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onTransactionEstimationError = useOnTransactionEstimationError()
  const { data: assets = [] } = useWithdrawTrackedAssets()
  const { isFetching: isAssetsFetching } = useWithdrawSwapData()

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

    updateTradingModal({
      isOpen: true,
      status: 'Wallet',
      action: skipSwap ? 'claim' : 'swap',
      link: '',
      sendTokens: skipSwap ? null : withdrawalContractTokens,
      receiveTokens: skipSwap ? withdrawalContractTokens : [receiveToken],
    })

    try {
      await withdraw()
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
    disabled: skipSwap ? false : isAssetsFetching,
    label: skipSwap ? t.claimAction : t.swapAction,
    handleTrade,
  }
}
