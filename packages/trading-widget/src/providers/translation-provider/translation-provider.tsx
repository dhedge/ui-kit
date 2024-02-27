import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

import type { TranslationMap } from './translation-default-data'
import { DEFAULT_TRANSLATION_DATA } from './translation-default-data'

export interface TranslationProviderProps {
  config?: Partial<TranslationMap>
}

export const TranslationProviderContext = createContext<
  Required<TranslationProviderProps['config']>
>(DEFAULT_TRANSLATION_DATA)

export const TranslationProvider: FC<
  PropsWithChildren<TranslationProviderProps>
> = ({ children, config }) => {
  const value = useMemo(
    () => ({
      ...DEFAULT_TRANSLATION_DATA,
      ...config,
    }),
    [config],
  )

  return (
    <TranslationProviderContext.Provider value={value}>
      {children}
    </TranslationProviderContext.Provider>
  )
}
