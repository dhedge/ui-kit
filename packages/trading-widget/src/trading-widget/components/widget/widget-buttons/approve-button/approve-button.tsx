import type { FC } from 'react'

import { ActionButton, Spinner } from 'trading-widget/components/common'
import { THEME_TYPE } from 'trading-widget/types'

import type { ApproveButtonProps } from './approve-button.hooks'
import { useApproveButton } from './approve-button.hooks'

export const ApproveButton: FC<ApproveButtonProps> = ({
  onApprove,
  symbol,
}) => {
  const { disabled, isLoading } = useApproveButton()

  return (
    <ActionButton disabled={disabled} onClick={onApprove}>
      <div className="dtw-flex dtw-items-center dtw-justify-center">
        <span>Approve {symbol}</span>
        {isLoading && (
          <span className="dtw-ml-1">
            <Spinner type={THEME_TYPE.DEFAULT} className="dtw-h-4 dtw-w-4" />
          </span>
        )}
      </div>
    </ActionButton>
  )
}
