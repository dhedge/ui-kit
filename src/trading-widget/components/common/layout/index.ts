import { InputGroup } from 'trading-widget/components/common/layout/input-group/input-group'
import { Meta } from 'trading-widget/components/common/layout/meta/meta'
import { Notification } from 'trading-widget/components/common/layout/notification/notification'
import { Overlay } from 'trading-widget/components/common/layout/overlay/overlay'
import { Panel } from 'trading-widget/components/common/layout/panel/panel'
import { Settings } from 'trading-widget/components/common/layout/settings/settings'

type LayoutCompoundedComponent = {
  InputGroup: typeof InputGroup
  Meta: typeof Meta
  Settings: typeof Settings
  Panel: typeof Panel
  Overlay: typeof Overlay
  Notification: typeof Notification
}

export const Layout: LayoutCompoundedComponent = {
  InputGroup,
  Meta,
  Settings,
  Panel,
  Overlay,
  Notification,
}
