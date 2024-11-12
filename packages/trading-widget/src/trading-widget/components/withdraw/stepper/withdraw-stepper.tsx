import { CheckCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

import { useWithdrawStepper } from 'trading-widget/components/withdraw/stepper/withdraw-stepper.hooks'

export const WithdrawStepper: FC<PropsWithChildren> = ({
  children: ActionButton,
}) => {
  const { hideStepper, steps, activeStepIndex } = useWithdrawStepper()

  if (hideStepper) {
    return ActionButton
  }

  return (
    <div className="dtw-mt-1 dtw-grid dtw-gap-1 dtw-grid-cols-[auto_1fr] dtw-auto-rows-min">
      {steps.map((step, index) => {
        const isCompleted = step.index < activeStepIndex
        const isActive = step.index === activeStepIndex
        const isLast = index === steps.length - 1
        return (
          <>
            <div
              className={classNames(
                'dtw-grid dtw-grid-cols-1 dtw-h-full dtw-gap-0.5',
                {
                  'dtw-text-themeGreen': isCompleted,
                  'dtw-text-[color:var(--panel-secondary-content-color)]':
                    !isCompleted && !isActive,
                  'dtw-grid-rows-[auto_1fr]': !isLast,
                },
              )}
            >
              {isCompleted ? (
                <CheckCircleIcon className="dtw-w-[18px]" />
              ) : (
                <span className="dtw-text-center dtw-text-sm">
                  {index + 1}.
                </span>
              )}
              {!isLast && (
                <div className="dtw-h-full dtw-min-h-1">
                  <div
                    className={classNames(
                      'dtw-w-[1px] dtw-h-full dtw-m-auto dtw-bg-[color:var(--panel-secondary-content-color)]',
                    )}
                  />
                </div>
              )}
            </div>
            <div
              key={step.index}
              className="dtw-flex dtw-flex-col dtw-gap-0.5 dtw-text-[length:var(--panel-input-label-font-size,var(--panel-font-size-sm))] dtw-text-[color:var(--panel-content-color)]"
            >
              <div
                className={classNames(
                  'dtw-mt-0.5 dtw-flex dtw-gap-1 dtw-leading-none dtw-items-center',
                  {
                    'dtw-text-[color:var(--panel-secondary-content-color)]':
                      !isCompleted && !isActive,
                  },
                )}
              >
                {step.description}
              </div>
              {isActive && (
                <div
                  className={classNames({
                    'dtw-my-1': !isLast,
                    'dtw-mt-1': isLast,
                  })}
                >
                  {ActionButton}
                </div>
              )}
            </div>
          </>
        )
      })}
    </div>
  )
}
