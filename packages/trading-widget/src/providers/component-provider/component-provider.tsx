import type { ComponentType, FC, PropsWithChildren } from 'react'
import { createContext } from 'react'

export interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  onError?: () => void
  className?: string
}

export interface ComponentProviderProps {
  config?: {
    GeoBlockAlert?: ComponentType
    DepositMetaInfo?: ComponentType
    WithdrawMetaInfo?: ComponentType
    ExtraActionButton?: ComponentType
    Image?: ComponentType<ImageProps>
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
