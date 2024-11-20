import { ArrowPathIcon } from '@heroicons/react/24/solid'

import classNames from 'classnames'
import type { FC } from 'react'

import { IconButton } from 'trading-widget/components/common/button/icon-button/icon-button'
import type { ReloadButtonProps } from 'trading-widget/components/common/button/reload-button/reload-button.hooks'
import { useReloadButton } from 'trading-widget/components/common/button/reload-button/reload-button.hooks'
import { InfoTooltip } from 'trading-widget/components/common/tooltip/info-tooltip/info-tooltip'

export const ReloadButton: FC<ReloadButtonProps> = (props) => {
  const { disabled, tooltipText, handleClick } = useReloadButton(props)
  return (
    <InfoTooltip text={tooltipText}>
      <IconButton
        Icon={ArrowPathIcon}
        onClick={handleClick}
        disabled={disabled}
        containerClassName="!dtw-self-center"
        className={classNames(
          'dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]',
          { 'dtw-opacity-50': disabled },
        )}
      />
    </InfoTooltip>
  )
}
