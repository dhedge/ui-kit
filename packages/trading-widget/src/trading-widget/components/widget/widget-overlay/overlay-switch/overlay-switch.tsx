import { Children, isValidElement } from 'react'
import type { FC, PropsWithChildren } from 'react'

import { useOverlayStateContext } from 'trading-widget/providers/overlay-provider'
import type { OverlayType } from 'trading-widget/types'
import { OVERLAY } from 'trading-widget/types'

const isOverlayType = (data: unknown): data is OverlayType =>
  Object.keys(OVERLAY).some((key) => key === data)

export const OverlaySwitch: FC<PropsWithChildren> = ({ children }) => {
  const state = useOverlayStateContext()

  let element = null

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const type = child.props.type

      if (isOverlayType(type) && state[type] && state[type].isOpen) {
        element = child
      }
    }
  })

  return element
}
