import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

import { DEFAULT_COMPONENT_PROVIDER_COMPONENTS } from './component-provider.defaults'

import type { ComponentProviderProps } from './component-provider.types'

export const ComponentProviderContext = createContext<
  Partial<ComponentProviderProps['config']>
>(DEFAULT_COMPONENT_PROVIDER_COMPONENTS)

export const ComponentProvider: FC<
  PropsWithChildren<ComponentProviderProps>
> = ({ children, config }) => {
  const value = useMemo<ComponentProviderProps['config']>(
    () => ({
      ...DEFAULT_COMPONENT_PROVIDER_COMPONENTS,
      ...config,
    }),
    [config],
  )

  return (
    <ComponentProviderContext.Provider value={value}>
      {children}
    </ComponentProviderContext.Provider>
  )
}
