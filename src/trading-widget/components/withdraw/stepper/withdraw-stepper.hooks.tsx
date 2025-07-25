import { useMemo } from 'react'

import { useIsCompleteWithdrawStep } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import {
  useInitWithdrawAllowance,
  useIsMultiAssetWithdraw,
  useIsUnrollAndClaimTransaction,
} from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { TooltipIcon } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

const APPROVE_STEP_INDEX = 0
const INIT_STEP_INDEX = 1
const COMPLETE_STEP_INDEX = 2

export const useWithdrawStepper = () => {
  const t = useTranslationContext()

  const { isCompleteWithdrawStep } = useIsCompleteWithdrawStep()
  const { canSpend } = useInitWithdrawAllowance()
  const isMultiAssetWithdraw = useIsMultiAssetWithdraw()
  const isUnrollAndClaimTransaction = useIsUnrollAndClaimTransaction()

  const steps = useMemo(() => {
    const steps = [
      {
        index: APPROVE_STEP_INDEX,
        description: <>{t.approve}</>,
      },
      {
        index: INIT_STEP_INDEX,
        description: isUnrollAndClaimTransaction ? (
          t.unrollAndClaimDescription
        ) : (
          <>
            {t.initWithdrawDescription}{' '}
            <TooltipIcon
              text={t.initWithdrawTooltip}
              iconClassName="!dtw-inline"
            />
          </>
        ),
      },
    ]

    const completeStep = {
      index: COMPLETE_STEP_INDEX,
      description: (
        <>
          <span>{t.completeWithdrawDescription}</span>
          <TooltipIcon
            text={t.completeWithdrawTooltip}
            iconClassName="!dtw-inline"
          />
        </>
      ),
    }

    return [...steps, ...(isUnrollAndClaimTransaction ? [] : [completeStep])]
  }, [
    t.approve,
    t.unrollAndClaimDescription,
    t.initWithdrawDescription,
    t.initWithdrawTooltip,
    t.completeWithdrawDescription,
    t.completeWithdrawTooltip,
    isUnrollAndClaimTransaction,
  ])

  const activeStepIndex = isCompleteWithdrawStep
    ? COMPLETE_STEP_INDEX
    : canSpend
      ? INIT_STEP_INDEX
      : APPROVE_STEP_INDEX

  return { hideStepper: isMultiAssetWithdraw, activeStepIndex, steps }
}
