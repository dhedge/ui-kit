import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import {
  OverlayProviderDispatchContext,
  OverlayProviderStateContext,
  useOverlayProvider,
} from 'trading-widget/providers/overlay-provider/overlay-provider.hooks'
import { OVERLAY } from 'trading-widget/types'

export const OverlayProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useOverlayProvider()
  const [{ isOpen }] = useTradingPanelModal()

  useEffect(() => {
    if (isOpen && !state.TRADING.isOpen) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: { type: OVERLAY.TRADING, isOpen },
      })
    }
  }, [isOpen, state.TRADING.isOpen, dispatch])

  useEffect(() => {
    if (!isOpen && state.TRADING.isOpen) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: { type: OVERLAY.TRADING, isOpen },
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
