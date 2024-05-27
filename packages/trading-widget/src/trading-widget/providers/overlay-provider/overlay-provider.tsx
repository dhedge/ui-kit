import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import { OVERLAY } from 'trading-widget/types'

import {
  OverlayProviderDispatchContext,
  OverlayProviderStateContext,
  useOverlayProvider,
} from './overlay-provider.hooks'

export const OverlayProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useOverlayProvider()
  const [{ isOpen }] = useTradingPanelModal()

  useEffect(() => {
    if (isOpen && !state.TRADING.isOpen) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: { type: OVERLAY.TRADING, isOpen: true },
      })
    }
  }, [isOpen, state.TRADING.isOpen, dispatch])

  return (
    <OverlayProviderDispatchContext.Provider value={dispatch}>
      <OverlayProviderStateContext.Provider value={state}>
        {children}
      </OverlayProviderStateContext.Provider>
    </OverlayProviderDispatchContext.Provider>
  )
}
