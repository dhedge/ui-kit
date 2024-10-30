import { useMemo } from 'react'

import { useReceiveTokenInput, useSendTokenInput } from 'core-kit/hooks/state'
import { useIsCompleteWithdrawStep } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import {
  useInitWithdrawAllowance,
  useIsMultiAssetWithdraw,
} from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { TooltipIcon } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const useWithdrawStepper = () => {
  const t = useTranslationContext()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const vaultSymbol = sendToken.symbol
  const assetSymbol = receiveToken.symbol

  const { isCompleteWithdrawStep } = useIsCompleteWithdrawStep()
  const { canSpend } = useInitWithdrawAllowance()
  const isMultiAssetWithdraw = useIsMultiAssetWithdraw()

  const steps = useMemo(
    () => ({
      APPROVE: {
        index: 0,
        description: (
          <>
            {t.approve} {vaultSymbol}{' '}
          </>
        ),
      },
      INIT: {
        index: 1,
        description: t.initWithdrawDescription.replace(
          '{vaultSymbol}',
          vaultSymbol,
        ),
      },
      COMPLETE: {
        index: 2,
        description: (
          <>
            {t.completeWithdrawDescription.replace(
              '{assetSymbol}',
              assetSymbol,
            )}{' '}
            <TooltipIcon
              text={t.completeWithdrawTooltip}
              iconClassName="!dtw-inline"
            />
          </>
        ),
      },
    }),
    [
      t.approve,
      t.initWithdrawDescription,
      t.completeWithdrawDescription,
      t.completeWithdrawTooltip,
      vaultSymbol,
      assetSymbol,
    ],
  )

  const activeStepIndex = isCompleteWithdrawStep
    ? steps.COMPLETE.index
    : canSpend
      ? steps.INIT.index
      : steps.APPROVE.index

  return { hideStepper: isMultiAssetWithdraw, activeStepIndex, steps }
}
