import { ArrowRightIcon, CheckIcon } from '@heroicons/react/20/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
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
    <div className="dtw-mt-1">
      {Object.values(steps).map((step) => {
        const completed = step.index < activeStepIndex
        const isActive = step.index === activeStepIndex
        return (
          <div
            key={step.index}
            className="dtw-flex dtw-flex-col dtw-gap-0.5 dtw-text-[length:var(--panel-input-label-font-size,var(--panel-font-size-sm))] dtw-text-[color:var(--panel-content-color)]"
          >
            <div
              className={classNames('dtw-flex dtw-gap-1', {
                'dtw-text-[color:var(--panel-secondary-content-color)]':
                  completed,
              })}
            >
              {completed ? (
                <CheckIcon className="dtw-w-4 dtw-text-themeGreen" />
              ) : isActive ? (
                <ArrowRightIcon className="dtw-w-4" />
              ) : (
                <ClockIcon className="dtw-w-4" />
              )}{' '}
              {step.description}
            </div>{' '}
            {isActive && <div className="dtw-my-0.5">{ActionButton}</div>}
          </div>
        )
      })}
    </div>
  )
}
