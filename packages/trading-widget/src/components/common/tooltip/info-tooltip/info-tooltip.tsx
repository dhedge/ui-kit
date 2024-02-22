import type { FC } from 'react'

import { TooltipWrapper } from '../tooltip-wrapper/tooltip-wrapper'
import type { TooltipWrapperProps } from '../tooltip-wrapper/tooltip-wrapper'

export type InfoTooltipProps = Omit<TooltipWrapperProps, 'tooltipContent'> & {
  text: string
}

export const InfoTooltip: FC<InfoTooltipProps> = ({ text, ...props }) => {
  return (
    <TooltipWrapper
      {...props}
      tooltipContent={
        <span className="dtw-inline-block dtw-max-w-xs">{text}</span>
      }
    />
  )
}
