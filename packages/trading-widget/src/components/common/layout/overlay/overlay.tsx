import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

interface OverlayProps {
  className?: string
}

export const Overlay: FC<PropsWithChildren<OverlayProps>> = ({
  children,
  className,
}) => (
  <div
    className={classNames(
      'dtw-absolute dtw-top-0 dtw-left-0 dtw-right-0 dtw-bottom-0 dtw-flex dtw-items-center dtw-justify-center dtw-rounded-xl dtw-backdrop-blur-md dtw-backdrop-brightness-75 dtw-backdrop-filter dtw-p-4',
      className,
    )}
  >
    {children}
  </div>
)
