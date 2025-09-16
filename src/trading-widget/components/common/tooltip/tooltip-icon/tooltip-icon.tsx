import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { ComponentType, FC, HTMLAttributes, SVGProps } from 'react'

import type { InfoTooltipProps } from 'trading-widget/components/common/tooltip/info-tooltip/info-tooltip'
import { InfoTooltip } from 'trading-widget/components/common/tooltip/info-tooltip/info-tooltip'

export interface TooltipIconProps extends InfoTooltipProps {
  iconClassName?: HTMLAttributes<SVGElement>['className']
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export const TooltipIcon: FC<TooltipIconProps> = ({
  text,
  placement,
  iconClassName = 'dtw-text-[color:var(--panel-secondary-content-color)]',
  Icon = QuestionMarkCircleIcon,
}) => {
  return (
    <InfoTooltip text={text} placement={placement}>
      <Icon
        className={classNames(
          'dtw-h-4 dtw-w-4 dtw-cursor-help hover:dtw-text-[color:var(--panel-icon-color-hover))]',
          iconClassName,
        )}
      />
    </InfoTooltip>
  )
}
