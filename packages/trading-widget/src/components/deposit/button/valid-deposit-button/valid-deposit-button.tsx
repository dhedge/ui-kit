import { commify } from '@dhedge/core-ui-kit/utils'
import type { FC, PropsWithChildren } from 'react'

import { ActionButton, DisabledButtonWithPrompt } from 'components/common'
import { ApproveButton } from 'components/widget/widget-buttons'

import { useTradingTypeName } from 'hooks'

import { useValidDepositButton } from './valid-deposit-button.hooks'

export const ValidDepositButton: FC<PropsWithChildren> = ({ children }) => {
  const name = useTradingTypeName('deposit')

  const {
    requiresMinDeposit,
    minDepositUSD,
    requiresApprove,
    requiresWhitelist,
    requiresUpdate,
    requiresHighSlippageConfirm,
    deprecated = false,
    poolSymbol,
    sendTokenSymbol,
    slippageToBeUsed,
    updateOracles,
    approve,
    confirmHighSlippage,
  } = useValidDepositButton()

  if (requiresMinDeposit) {
    return (
      <ActionButton disabled highlighted>{`Minimum purchase is $${commify(
        minDepositUSD.toString() ?? '',
      )}`}</ActionButton>
    )
  }

  if (requiresWhitelist) {
    return (
      <DisabledButtonWithPrompt
        promptText={
          deprecated
            ? `${poolSymbol} token is no longer active. Please withdraw from them.`
            : 'This vault is currently private'
        }
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (requiresApprove) {
    return <ApproveButton symbol={sendTokenSymbol} onApprove={approve} />
  }

  if (requiresUpdate) {
    return (
      <ActionButton onClick={updateOracles} highlighted>
        Update Oracles
      </ActionButton>
    )
  }

  if (requiresHighSlippageConfirm) {
    return (
      <ActionButton onClick={confirmHighSlippage} highlighted>
        {`Confirm ${Math.abs(slippageToBeUsed)}% max slippage`}
      </ActionButton>
    )
  }

  return children
}
