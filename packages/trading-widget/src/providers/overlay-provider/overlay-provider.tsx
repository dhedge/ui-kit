import type { FC, PropsWithChildren } from 'react'

import {
  OverlayProviderDispatchContext,
  OverlayProviderStateContext,
  useOverlayProvider,
} from './overlay-provider.hooks'

export const OverlayProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useOverlayProvider()

  return (
    <OverlayProviderDispatchContext.Provider value={dispatch}>
      <OverlayProviderStateContext.Provider value={state}>
        {children}
      </OverlayProviderStateContext.Provider>
    </OverlayProviderDispatchContext.Provider>
  )
}
