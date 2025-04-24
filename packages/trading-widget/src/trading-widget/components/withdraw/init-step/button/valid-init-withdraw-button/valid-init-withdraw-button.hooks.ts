import { formatDuration, intervalToDuration } from 'date-fns'

import {
  usePoolDynamicContractData,
  usePoolDynamicExitRemainingCooldown,
} from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSynthetixV3OraclesUpdate } from 'core-kit/hooks/trading'
import { useWithdrawLiquidity } from 'core-kit/hooks/trading/synthetix-v3/use-withdraw-liquidity'
import { useInitWithdrawAllowance } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { isSynthetixV3Vault } from 'core-kit/utils'

import {
  useHighSlippageCheck,
  useSynthetixWithdrawalWindow,
} from 'trading-widget/hooks'
import { useLeveragedWithdrawalChecks } from 'trading-widget/hooks/use-leveraged-withdrawal-checks'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useValidInitWithdrawButton = () => {
  const { address, chainId, maintenance, maintenanceWithdrawals, symbol } =
    useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const { isWithdrawal, startTime } = useSynthetixWithdrawalWindow()
  const dispatch = useOverlayDispatchContext()

  const { getExitRemainingCooldown } = usePoolDynamicContractData({
    address,
    chainId,
  })

  const { data: dynamicCooldownMs = 0 } = usePoolDynamicExitRemainingCooldown({
    address,
    chainId,
    enabled: Number(getExitRemainingCooldown ?? '0') > 0,
  })

  const dynamicCooldownActive = dynamicCooldownMs > 0
  const dynamicCooldownEndsInTime = formatDuration(
    intervalToDuration({ start: 0, end: dynamicCooldownMs }),
  )

  const { approve, canSpend } = useInitWithdrawAllowance()
  const { needToBeUpdated, updateOracles, isCheckOraclesPending } =
    useSynthetixV3OraclesUpdate({
      disabled: !canSpend || dynamicCooldownActive,
    })
  const { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed } =
    useHighSlippageCheck()
  const liquidity = useWithdrawLiquidity()

  const {
    requiresLeveragedCollateralLiquidity,
    leveragedCollateralValueFormatted,
  } = useLeveragedWithdrawalChecks()

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

  const performSynthetixWithdrawalChecks = isSynthetixV3Vault(address)

  return {
    requiresWithdrawalWindow: performSynthetixWithdrawalChecks && !isWithdrawal,
    requiresWithdrawalLiquidity:
      performSynthetixWithdrawalChecks &&
      !!sendToken.value &&
      liquidity.noLiquidity,
    requiresEndOfCooldown: dynamicCooldownActive,
    requiresApprove: !canSpend,
    requiresHighSlippageConfirm,
    requiresUpdate: needToBeUpdated && !!sendToken.value,
    sendTokenSymbol: sendToken.symbol,
    slippageToBeUsed,
    dynamicCooldownEndsInTime,
    withdrawalWindowStartTime: startTime,
    withdrawalLiquidity: `${liquidity.symbol} ${liquidity.availableLiquidity ?? '0'}`,
    approve,
    updateOracles,
    handleHighSlippageClick,
    isCheckOraclesPending,
    requiresLeveragedCollateralLiquidity,
    leveragedCollateralValueFormatted,
    maintenance: maintenance || maintenanceWithdrawals,
    poolSymbol: symbol,
  }
}
