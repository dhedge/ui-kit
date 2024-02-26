import { useContext } from 'react'

import { TranslationProviderContext } from './translation-provider'

export const useTranslationContext = () => {
  const context = useContext(TranslationProviderContext)

  if (!context) {
    throw new Error('TranslationContext is used out of Provider')
  }

  return context
}
