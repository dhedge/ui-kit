import { Balance } from './balance/balance'
import { InputGroup } from './input-group/input-group'
import { Meta } from './meta/meta'
import { Panel } from './panel/panel'
import { Settings } from './settings/settings'

type LayoutCompoundedComponent = {
  Balance: typeof Balance
  InputGroup: typeof InputGroup
  Meta: typeof Meta
  Settings: typeof Settings
  Panel: typeof Panel
}

export const Layout: LayoutCompoundedComponent = {
  Balance,
  InputGroup,
  Meta,
  Settings,
  Panel,
}
