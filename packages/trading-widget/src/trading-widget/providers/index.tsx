import type { FC, PropsWithChildren } from 'react'

import type { ThemeProviderConfigProps } from 'limit-orders/providers/theme-provider'
import { LimitOrderProvider } from 'trading-widget/providers/limit-order-provider/limit-order-provider'

import type { ComponentProviderProps } from './component-provider'
import { ComponentProvider } from './component-provider'
import type { ConfigProviderProps } from './config-provider'
import { ConfigProvider } from './config-provider'
import { OverlayProvider } from './overlay-provider'
import type { ThemeProviderProps } from './theme-provider'
import { ThemeProvider } from './theme-provider'
import type { TranslationProviderProps } from './translation-provider'
import { TranslationProvider } from './translation-provider'

export interface ProvidersProps {
  theme?: ThemeProviderProps['config']
  config?: ConfigProviderProps['config']
  components?: ComponentProviderProps['config']
  translation?: TranslationProviderProps['config']
  limitOrderThemeConfig?: ThemeProviderConfigProps
}

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  config,
  theme,
  components,
  translation,
  limitOrderThemeConfig,
}) => (
  <TranslationProvider config={translation}>
    <ThemeProvider config={theme}>
      <ConfigProvider config={config}>
        <ComponentProvider config={components}>
          <OverlayProvider>
            <LimitOrderProvider config={limitOrderThemeConfig}>
              {children}
            </LimitOrderProvider>
          </OverlayProvider>
        </ComponentProvider>
      </ConfigProvider>
    </ThemeProvider>
  </TranslationProvider>
)
