import { useContext } from 'react'

import { ConfigProviderContext } from './config-provider'

export const useConfigContext = () => {
  const context = useContext(ConfigProviderContext)

  if (!context) {
    throw new Error('ConfigContext is used out of Provider')
  }

  return context
}
