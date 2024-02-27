import { usePoolDynamicContractData } from '@dhedge/core-ui-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from '@dhedge/core-ui-kit/hooks/state'
import { useSynthetixV3OraclesUpdate } from '@dhedge/core-ui-kit/hooks/trading'
import { useWithdrawAllowance } from '@dhedge/core-ui-kit/hooks/trading/withdraw'
import { isSynthetixV3Vault } from '@dhedge/core-ui-kit/utils'

import { useHighSlippageCheck, useSynthetixWithdrawalWindow } from 'hooks'

export const useValidWithdrawButton = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const { isWithdrawal, startTime } = useSynthetixWithdrawalWindow()

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
    confirmHighSlippage,
  }
}
