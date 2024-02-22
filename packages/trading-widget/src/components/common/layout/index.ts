import { Meta } from './meta/meta'
import { Panel } from './panel/panel'
import { Settings } from './settings/settings'

type LayoutCompoundedComponent = {
  Meta: typeof Meta
  Settings: typeof Settings
  Panel: typeof Panel
}

export const Layout: LayoutCompoundedComponent = {
  Meta,
  Settings,
  Panel,
}
