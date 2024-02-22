import type { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'

export interface ConfigProviderProps {
  config?: {
    isGeoBlocked?: boolean
  }
}

export const ConfigProviderContext = createContext<
  Partial<ConfigProviderProps['config']>
>({})

export const ConfigProvider: FC<PropsWithChildren<ConfigProviderProps>> = ({
  children,
  config = {},
}) => {
  return (
    <ConfigProviderContext.Provider value={config}>
      {children}
    </ConfigProviderContext.Provider>
  )
}
