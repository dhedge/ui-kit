import {
  ThemeProvider,
  ThemeProviderProps,
} from './theme-provider/theme-provider'
import { FC, PropsWithChildren } from 'react'

type ProvidersProps = ThemeProviderProps

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  config,
}) => <ThemeProvider config={config}>{children}</ThemeProvider>
