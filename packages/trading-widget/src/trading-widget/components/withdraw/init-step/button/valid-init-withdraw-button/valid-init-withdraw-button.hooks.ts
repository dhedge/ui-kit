import { usePoolDynamicContractData } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSynthetixV3OraclesUpdate } from 'core-kit/hooks/trading'
import { useWithdrawLiquidity } from 'core-kit/hooks/trading/synthetix-v3/use-withdraw-liquidity'
import { useInitWithdrawAllowance } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import {
  isDeprecatedSynthetixV3Vault,
  isSynthetixV3Vault,
} from 'core-kit/utils'

import {
  useHighSlippageCheck,
  useSynthetixWithdrawalWindow,
} from 'trading-widget/hooks'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useValidInitWithdrawButton = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const { isWithdrawal, startTime } = useSynthetixWithdrawalWindow()
  const dispatch = useOverlayDispatchContext()

  const { cooldownActive, cooldownEndsInTime } = usePoolDynamicContractData({
    address,
    chainId,
  })
  const { approve, canSpend } = useInitWithdrawAllowance()
  const { needToBeUpdated, updateOracles, isCheckOraclesPending } =
    useSynthetixV3OraclesUpdate({
      disabled: !canSpend || cooldownActive,
    })
  const { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed } =
    useHighSlippageCheck()
  const liquidity = useWithdrawLiquidity()

  const handleHighSlippageClick = () => {
    dispatch({
      type: 'MERGE_OVERLAY',
      payload: {
        type: OVERLAY.HIGH_SLIPPAGE,
        isOpen: true,
        onConfirm: async () => confirmHighSlippage(),
      },
    })
  }

  const isSynthetixVault = isSynthetixV3Vault(address)
  // TODO: remove after these vaults will be fully deprecated
  const isDeprecatedSynthetixVault = isDeprecatedSynthetixV3Vault(address)

  return {
    requiresWithdrawalWindow:
      isSynthetixVault && !isDeprecatedSynthetixVault && !isWithdrawal,
    requiresWithdrawalLiquidity:
      isSynthetixVault && !!sendToken.value && liquidity.noLiquidity,
    requiresEndOfCooldown: cooldownActive,
    requiresApprove: !canSpend,
    requiresHighSlippageConfirm,
    requiresUpdate: needToBeUpdated && !!sendToken.value,
    sendTokenSymbol: sendToken.symbol,
    slippageToBeUsed,
    cooldownEndsInTime,
    withdrawalWindowStartTime: startTime,
    withdrawalLiquidity: liquidity.availableLiquidity ?? '0',
    withdrawalLiquiditySymbol: liquidity.symbol,
    approve,
    updateOracles,
    handleHighSlippageClick,
    isCheckOraclesPending,
  }
}
