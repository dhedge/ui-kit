import type { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'

export interface ConfigProviderProps {
  config?: {
    params: {
      isGeoBlocked?: boolean
      depositQuoteDiffErrorThreshold?: number
    }
    actions: {
      onConnect: () => void
    }
  }
}

const defaultValue: ConfigProviderProps['config'] = {
  params: {
    isGeoBlocked: false,
    depositQuoteDiffErrorThreshold: 3,
  },
  actions: {
    onConnect: () => {},
  },
}

export const ConfigProviderContext =
  createContext<ConfigProviderProps['config']>(defaultValue)

export const ConfigProvider: FC<PropsWithChildren<ConfigProviderProps>> = ({
  children,
  config = defaultValue,
}) => {
  return (
    <ConfigProviderContext.Provider value={config}>
      {children}
    </ConfigProviderContext.Provider>
  )
}
