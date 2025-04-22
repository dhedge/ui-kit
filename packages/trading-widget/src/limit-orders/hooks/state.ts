import { useContext } from 'react'

import {
  LimitOrderActionsContext,
  LimitOrderStateContext,
} from 'limit-orders/providers/state-provider/state-provider'

export const useLimitOrderState = () => useContext(LimitOrderStateContext)

export const useLimitOrderActions = () => useContext(LimitOrderActionsContext)
