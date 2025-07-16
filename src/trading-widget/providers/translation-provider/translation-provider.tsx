import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

import { DEFAULT_TRANSLATION_DATA } from 'trading-widget/providers/translation-provider/translation-provider.defaults'
import type { TranslationProviderProps } from 'trading-widget/providers/translation-provider/translation-provider.types'

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
