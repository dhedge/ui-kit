import type { ComponentType, FC, PropsWithChildren } from 'react'
import { createContext } from 'react'

export interface ComponentProviderProps {
  config?: {
    GeoBlockAlert?: ComponentType
    DepositMetaInfo?: ComponentType
    WithdrawMetaInfo?: ComponentType
  }
}

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
