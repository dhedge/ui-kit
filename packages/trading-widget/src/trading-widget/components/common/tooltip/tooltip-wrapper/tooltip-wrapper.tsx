import type { FC, ReactNode } from 'react'
import type { Config } from 'react-popper-tooltip'
import { usePopperTooltip } from 'react-popper-tooltip'

export interface TooltipWrapperProps
  extends Pick<Config, 'placement' | 'trigger' | 'interactive' | 'delayHide'> {
  tooltipContent: ReactNode
  children?: ReactNode
}

export const TooltipWrapper: FC<TooltipWrapperProps> = ({
  tooltipContent,
  children,
  placement = 'top',
  trigger = 'hover',
  interactive = true,
  delayHide = 50,
}) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    interactive,
    delayHide,
    offset: [0, 12],
    placement,
    trigger,
  })

  return (
    <>
      <span ref={setTriggerRef}>{children}</span>
      {visible && (
        <span
          ref={setTooltipRef}
          {...getTooltipProps({
            className:
              'tooltip-container dtw-z-50 dtw-bg-themeGray-700 dtw-text-white dtw-px-2 dtw-py-1.5 dtw-rounded-md dtw-text-xs dtw-text-center dtw-block dtw-whitespace-normal',
          })}
        >
          {tooltipContent}
          <span {...getArrowProps({ className: 'tooltip-arrow' })} />
        </span>
      )}
    </>
  )
}
