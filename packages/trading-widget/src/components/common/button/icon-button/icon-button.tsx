import classNames from 'classnames'
import type { ComponentProps, FC, FunctionComponent } from 'react'

interface IconButtonProps {
  Icon: FunctionComponent<Omit<ComponentProps<'svg'>, 'ref'>>
  onClick?: () => void
  className?: string
  containerClassName?: string
}

export const IconButton: FC<IconButtonProps> = ({
  Icon,
  onClick,
  className = 'dtw-h-7 dtw-w-7',
  containerClassName,
}) => (
  <div
    className={classNames(
      'dtw-group dtw-w-fit dtw-cursor-pointer dtw-self-end dtw-rounded-lg dtw-p-1 hover:dtw-bg-gray-700',
      containerClassName,
    )}
    onClick={onClick}
  >
    <Icon
      className={classNames(
        'dtw-text-themeGray group-hover:dtw-text-white',
        className,
      )}
    />
  </div>
)
