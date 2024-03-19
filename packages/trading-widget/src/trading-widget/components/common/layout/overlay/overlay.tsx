import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

interface OverlayProps {
  className?: string
  transparent?: boolean
}

export const Overlay: FC<PropsWithChildren<OverlayProps>> = ({
  children,
  className,
  transparent = false,
}) => (
  <div className="dtw-absolute dtw-top-0 dtw-inset-0 dtw-rounded-xl dtw-backdrop-blur-md dtw-backdrop-brightness-75 dtw-backdrop-filter dtw-p-4">
    <div
      className={classNames(
        'dtw-flex dtw-flex-col dtw-items-center dtw-rounded-xl dtw-justify-center dtw-p-4 dtw-h-full',
        className,
        {
          'dtw-bg-[var(--panel-popup-bg,var(--panel-secondary-color))]':
            !transparent,
        },
      )}
    >
      {children}
    </div>
  </div>
)
