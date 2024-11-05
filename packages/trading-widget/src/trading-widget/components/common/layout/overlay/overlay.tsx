import { XMarkIcon } from '@heroicons/react/16/solid'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { IconButton } from 'trading-widget/components/common/button/icon-button/icon-button'

interface OverlayProps {
  className?: string
  transparent?: boolean
  onClose?: () => void
  centered?: boolean
}

export const Overlay: FC<PropsWithChildren<OverlayProps>> = ({
  children,
  className,
  transparent = false,
  centered = true,
  onClose,
}) => {

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleEscKey)

    return () => {
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [onClose])

  return (
    <div className="dtw-absolute dtw-top-0 dtw-inset-0 dtw-rounded-xl dtw-backdrop-blur-md dtw-backdrop-brightness-75 dtw-backdrop-filter dtw-p-4">
      <div
        className={classNames(
          'dtw-flex dtw-flex-col dtw-rounded-xl dtw-p-4 dtw-h-full',
          className,
          {
            'dtw-bg-[var(--panel-popup-bg,var(--panel-secondary-color))]':
              !transparent,
            'dtw-items-center dtw-justify-center': centered,
          },
        )}
      >
        {children}
        {!!onClose && (
          <div className="dtw-absolute dtw-top-5 dtw-right-5">
            <IconButton Icon={XMarkIcon} onClick={onClose} />
          </div>
        )}
      </div>
    </div>
  )
}
