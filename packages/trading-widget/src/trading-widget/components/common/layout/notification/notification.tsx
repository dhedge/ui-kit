import { XMarkIcon } from '@heroicons/react/16/solid'
import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { IconButton } from 'trading-widget/components/common/button/icon-button/icon-button'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface NotificationProps {
  onClose?: () => void
}

export const Notification: FC<PropsWithChildren<NotificationProps>> = ({
  children,
  onClose,
}) => {
  const { defaultNotificationDuration } = useConfigContextParams()

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

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, defaultNotificationDuration)

    return () => {
      clearTimeout(timer)
    }
  }, [defaultNotificationDuration, onClose])

  return (
    <div className="dtw-p-4 dtw-absolute dtw-top-0 dtw-inset-x-0 dtw-rounded-xl dtw-bg-[var(--panel-notification-bg,var(--panel-secondary-color))]">
      <div className="dtw-flex dtw-justify-between dtw-items-center">
        <div>{children}</div>
        {!!onClose && (
          <IconButton
            Icon={XMarkIcon}
            onClick={onClose}
            className="dtw-w-6 dtw-h-6"
            containerClassName="dtw-self-center"
          />
        )}
      </div>
    </div>
  )
}
