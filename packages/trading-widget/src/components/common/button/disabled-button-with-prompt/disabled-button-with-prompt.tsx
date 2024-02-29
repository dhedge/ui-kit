import {
  ExclamationCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

import type { FC, PropsWithChildren } from 'react'

import { InfoTooltip } from '../../tooltip/info-tooltip/info-tooltip'
import { ActionButton } from '../action-button/action-button'

interface DisabledButtonWithPromptProps {
  promptText: string
}

export const DisabledButtonWithPrompt: FC<
  PropsWithChildren<DisabledButtonWithPromptProps>
> = ({ children, promptText }) => {
  return (
    <div>
      <div className="md:dtw-hidden dtw-mb-4 dtw-flex dtw-items-center dtw-justify-center dtw-space-x-1 dtw-text-yellow-400">
        <ExclamationCircleIcon className="dtw-h-5 dtw-w-5" />
        <div className="dtw-py-1 dtw-text-center dtw-text-xs">{promptText}</div>
      </div>
      <InfoTooltip text={promptText}>
        <ActionButton disabled>
          <div className="dtw-flex dtw-items-center dtw-justify-center dtw-gap-2">
            <LockClosedIcon className="dtw-h-5" />
            <span>{children}</span>
          </div>
        </ActionButton>
      </InfoTooltip>
    </div>
  )
}
