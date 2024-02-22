import { useContext } from 'react'

import { ComponentProviderContext } from './component-provider'

export const useComponentContext = () => {
  const context = useContext(ComponentProviderContext)

  if (!context) {
    throw new Error('ComponentContext is used out of Provider')
  }

  return context
}
