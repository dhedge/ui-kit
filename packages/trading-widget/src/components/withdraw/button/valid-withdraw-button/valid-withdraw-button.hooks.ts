import { usePoolDynamicContractData } from '@dhedge/core-ui-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from '@dhedge/core-ui-kit/hooks/state'
import { useSynthetixV3OraclesUpdate } from '@dhedge/core-ui-kit/hooks/trading'
import { useWithdrawAllowance } from '@dhedge/core-ui-kit/hooks/trading/withdraw'
import { isSynthetixV3Vault } from '@dhedge/core-ui-kit/utils'

import { useHighSlippageCheck, useSynthetixWithdrawalWindow } from 'hooks'
import { useOverlayDispatchContext } from 'providers/overlay-provider'
import { OVERLAY } from 'types'

export const useValidWithdrawButton = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const { isWithdrawal, startTime } = useSynthetixWithdrawalWindow()
  const dispatch = useOverlayDispatchContext()

  const { cooldownActive, cooldownEndsInTime } = usePoolDynamicContractData({
    address,
    chainId,
  })
  const { approve, canSpend } = useWithdrawAllowance()
  const { needToBeUpdated, updateOracles } = useSynthetixV3OraclesUpdate({
    disabled: !canSpend || cooldownActive,
  })
  const { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed } =
    useHighSlippageCheck()

  const handleHighSlippageClick = () => {
    dispatch({
      type: 'MERGE_OVERLAY',
      payload: {
        type: OVERLAY.HIGH_SLIPPAGE,
        isOpen: true,
        onConfirm: confirmHighSlippage,
      },
    })
  }

  return {
    requiresWithdrawalWindow: isSynthetixV3Vault(address) && !isWithdrawal,
    requiresEndOfCooldown: cooldownActive,
    requiresApprove: !canSpend,
    requiresHighSlippageConfirm,
    requiresUpdate: needToBeUpdated && !!sendToken.value,
    sendTokenSymbol: sendToken.symbol,
    slippageToBeUsed,
    cooldownEndsInTime,
    withdrawalWindowStartTime: startTime,
    approve,
    updateOracles,
    handleHighSlippageClick,
  }
}
