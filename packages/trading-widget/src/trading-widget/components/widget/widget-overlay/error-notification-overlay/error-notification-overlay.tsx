import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'
import { useErrorNotificationOverlay } from 'trading-widget/components/widget/widget-overlay/error-notification-overlay/error-notification-overlay.hooks'
import type { OverlayProps } from 'trading-widget/types'

export const ErrorNotificationOverlay: FC<OverlayProps> = (props) => {
  const { handleReject, error } = useErrorNotificationOverlay(props)

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
