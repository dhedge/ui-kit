import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

import {
  DEFAULT_CONFIG_PARAMS,
  useConfigProviderDefaultActions,
} from './config-provider.defaults'
import type {
  ConfigProviderProps,
  ConfigProviderState,
} from './config-provider.types'

const defaultValue: ConfigProviderState = {
  params: {
    ...DEFAULT_CONFIG_PARAMS,
  },
  actions: {
    onConnect: () => {},
  },
}

export const ConfigProviderContext =
  createContext<ConfigProviderState>(defaultValue)

export const ConfigProvider: FC<PropsWithChildren<ConfigProviderProps>> = ({
  children,
  config,
}) => {
  const defaultActions = useConfigProviderDefaultActions()

  const value = useMemo(
    () => ({
      params: {
        ...DEFAULT_CONFIG_PARAMS,
        ...config?.params,
      },
      actions: {
        ...defaultActions,
        ...config?.actions,
      },
    }),
    [config, defaultActions],
  )

  return (
    <ConfigProviderContext.Provider value={value}>
      {children}
    </ConfigProviderContext.Provider>
  )
}
