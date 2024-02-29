import type { FC, PropsWithChildren } from 'react'

import type { ComponentProviderProps } from './component-provider'
import { ComponentProvider } from './component-provider'
import type { ConfigProviderProps } from './config-provider'
import { ConfigProvider } from './config-provider'
import type { ThemeProviderProps } from './theme-provider'
import { ThemeProvider } from './theme-provider'
import type { TranslationProviderProps } from './translation-provider'
import { TranslationProvider } from './translation-provider'

export interface ProvidersProps {
  theme?: ThemeProviderProps['config']
  config?: ConfigProviderProps['config']
  components?: ComponentProviderProps['config']
  translation?: TranslationProviderProps['config']
}

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  config,
  theme,
  components,
  translation,
}) => (
  <TranslationProvider config={translation}>
    <ThemeProvider config={theme}>
      <ConfigProvider config={config}>
        <ComponentProvider config={components}>{children}</ComponentProvider>
      </ConfigProvider>
    </ThemeProvider>
  </TranslationProvider>
)
