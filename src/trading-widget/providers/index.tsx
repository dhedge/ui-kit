import type { FC, PropsWithChildren } from 'react'

import type { ComponentProviderProps } from 'trading-widget/providers/component-provider'
import { ComponentProvider } from 'trading-widget/providers/component-provider'
import type { ConfigProviderProps } from 'trading-widget/providers/config-provider'
import { ConfigProvider } from 'trading-widget/providers/config-provider'
import { OverlayProvider } from 'trading-widget/providers/overlay-provider'
import type { ThemeProviderProps } from 'trading-widget/providers/theme-provider'
import { ThemeProvider } from 'trading-widget/providers/theme-provider'
import type { TranslationProviderProps } from 'trading-widget/providers/translation-provider'
import { TranslationProvider } from 'trading-widget/providers/translation-provider'

export interface ProvidersProps {
  theme?: ThemeProviderProps['config']
  config?: ConfigProviderProps['config']
  components?: ComponentProviderProps['config']
  translation?: TranslationProviderProps['config']
  className?: string
}

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  config,
  theme,
  components,
  translation,
  className,
}) => (
  <TranslationProvider config={translation}>
    <ThemeProvider config={theme} className={className}>
      <ConfigProvider config={config}>
        <ComponentProvider config={components}>
          <OverlayProvider>{children}</OverlayProvider>
        </ComponentProvider>
      </ConfigProvider>
    </ThemeProvider>
  </TranslationProvider>
)
