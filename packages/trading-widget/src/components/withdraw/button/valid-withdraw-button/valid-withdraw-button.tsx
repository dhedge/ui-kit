import type { FC, PropsWithChildren } from 'react'

import { ActionButton, DisabledButtonWithPrompt } from 'components/common'
import { ApproveButton } from 'components/widget/widget-buttons'

import { useTradingTypeName } from 'hooks'

import { useValidWithdrawButton } from './valid-withdraw-button.hooks'

export const ValidWithdrawButton: FC<PropsWithChildren> = ({ children }) => {
  const name = useTradingTypeName('withdraw')
  const {
    requiresWithdrawalWindow,
    requiresEndOfCooldown,
    requiresApprove,
    requiresHighSlippageConfirm,
    requiresUpdate,
    sendTokenSymbol,
    slippageToBeUsed,
    cooldownEndsInTime,
    withdrawalWindowStartTime,
    approve,
    updateOracles,
    confirmHighSlippage,
  } = useValidWithdrawButton()

  if (requiresWithdrawalWindow) {
    return (
      <DisabledButtonWithPrompt
        promptText={`You can sell your ${sendTokenSymbol} tokens during withdrawal window period starting from ${withdrawalWindowStartTime}`}
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (requiresEndOfCooldown) {
    return (
      <DisabledButtonWithPrompt
        promptText={`You can sell your ${sendTokenSymbol} tokens in ${cooldownEndsInTime}`}
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (requiresApprove) {
    return <ApproveButton onApprove={approve} symbol={sendTokenSymbol} />
  }

  if (requiresHighSlippageConfirm) {
    return (
      <ActionButton onClick={confirmHighSlippage} highlighted>
        {`Confirm ${Math.abs(slippageToBeUsed)}% max slippage`}
      </ActionButton>
    )
  }

  if (requiresUpdate) {
    return (
      <ActionButton onClick={updateOracles} highlighted>
        Update Oracles
      </ActionButton>
    )
  }

  return children
}
