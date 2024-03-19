import type { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'

import type { ComponentProviderProps } from './component-provider.types'

export const ComponentProviderContext = createContext<
  Partial<ComponentProviderProps['config']>
>({})

export const ComponentProvider: FC<
  PropsWithChildren<ComponentProviderProps>
> = ({ children, config = {} }) => (
  <ComponentProviderContext.Provider value={config}>
    {children}
  </ComponentProviderContext.Provider>
)
