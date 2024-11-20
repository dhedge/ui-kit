import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'
import { useNotificationOverlay } from 'trading-widget/components/widget/widget-overlay/notification-overlay/notification-overlay.hooks'
import type { OverlayProps } from 'trading-widget/types'

export const NotificationOverlay: FC<OverlayProps> = (props) => {
  const { handleReject, error } = useNotificationOverlay(props)

  if (!error) {
    return null
  }

  return (
    <Layout.Notification onClose={handleReject}>
      <p className="dtw-text-sm">{error.title}</p>
      {error.hint && <p className="dtw-text-xs">{error.hint}</p>}
    </Layout.Notification>
  )
}
