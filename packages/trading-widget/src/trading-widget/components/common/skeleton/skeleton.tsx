import classNames from 'classnames'
import type { CSSProperties, FC } from 'react'

interface SkeletonProps {
  style?: CSSProperties
  className?: string
  size?: string
}

export const Skeleton: FC<SkeletonProps> = ({ style, className }) => {
  return (
    <div
      className={classNames(
        'tw-animate-pulse tw-rounded tw-bg-themeGray-300 tw-bg-opacity-50 tw-h-6',
        className,
      )}
      style={style}
    ></div>
  )
}
