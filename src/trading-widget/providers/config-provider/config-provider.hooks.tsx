import { useContext } from 'react'

import { ConfigProviderContext } from 'trading-widget/providers/config-provider/config-provider'

export const useConfigContext = () => {
  const context = useContext(ConfigProviderContext)

  if (!context) {
    throw new Error('ConfigContext is used out of Provider')
  }

  return context
}

export const useConfigContextParams = () => useConfigContext().params
export const useConfigContextActions = () => useConfigContext().actions
