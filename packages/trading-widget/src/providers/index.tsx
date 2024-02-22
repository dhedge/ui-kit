import type { FC, PropsWithChildren } from 'react'

import type { ComponentProviderProps } from './component-provider/component-provider'
import { ComponentProvider } from './component-provider/component-provider'
import type { ConfigProviderProps } from './config-provider/config-provider'
import { ConfigProvider } from './config-provider/config-provider'
import type { ThemeProviderProps } from './theme-provider/theme-provider'
import { ThemeProvider } from './theme-provider/theme-provider'

export interface ProvidersProps {
  theme?: ThemeProviderProps['config']
  config?: ConfigProviderProps['config']
  components?: ComponentProviderProps['config']
}

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  config,
  theme,
  components,
}) => (
  <ThemeProvider config={theme}>
    <ConfigProvider config={config}>
      <ComponentProvider config={components}>{children}</ComponentProvider>
    </ConfigProvider>
  </ThemeProvider>
)
