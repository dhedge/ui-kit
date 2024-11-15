import classNames from 'classnames'
import type { ComponentProps, FC, FunctionComponent } from 'react'

interface IconButtonProps {
  Icon: FunctionComponent<Omit<ComponentProps<'svg'>, 'ref'>>
  onClick?: () => void
  className?: string
  disabled?: boolean
  containerClassName?: string
}

export const IconButton: FC<IconButtonProps> = ({
  Icon,
  onClick,
  className = 'dtw-h-7 dtw-w-7',
  containerClassName,
  disabled,
}) => (
  <div
    className={classNames(
      'dtw-group dtw-w-fit dtw-cursor-pointer dtw-self-end dtw-rounded-lg dtw-p-1 hover:dtw-opacity-80',
      containerClassName,
      { 'dtw-pointer-events-none': disabled },
    )}
    onClick={onClick}
  >
    <Icon
      className={classNames(
        'dtw-text-[color:var(--panel-icon-color)] group-hover:dtw-text-white',
        className,
      )}
    />
  </div>
)
