import classNames from 'classnames'
import type { FC } from 'react'

interface StepperProps {
  step1: string
  step2: string
  isStep1Active?: boolean
  className?: string
}

const STEP_CLASSES =
  'dtw-px-2.5 dtw-inline-flex dtw-items-center dtw-justify-center dtw-h-5 dtw-rounded-full dtw-text-xs dtw-bg-[var(--panel-tab-bg,var(--panel-neutral-color))]'
const DISABLED_CLASSES = 'dtw-opacity-40'

export const Stepper: FC<StepperProps> = ({
  step1,
  step2,
  isStep1Active,
  className,
}) => (
  <div className={classNames('dtw-grid dtw-grid-cols-3', className)}>
    <div
      className={classNames('dtw-text-right', {
        [DISABLED_CLASSES]: !isStep1Active,
      })}
    >
      <span className={STEP_CLASSES}>{step1}</span>
    </div>
    <div className={classNames('dtw-flex dtw-items-center', DISABLED_CLASSES)}>
      <div className="dtw-h-0.5 dtw-w-full dtw-bg-[var(--panel-tab-bg,var(--panel-neutral-color))]"></div>
    </div>
    <div
      className={classNames('dtw-text-left', {
        [DISABLED_CLASSES]: isStep1Active,
      })}
    >
      <span className={STEP_CLASSES}>{step2}</span>
    </div>
  </div>
)
