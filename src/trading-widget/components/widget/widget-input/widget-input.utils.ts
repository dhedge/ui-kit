import BigNumber from 'bignumber.js'
import type { WheelEventHandler } from 'react'

export function formatInputValue(value: string, disabled: boolean): string {
  const inputAsBn = new BigNumber(value)
  if (disabled && inputAsBn.gt(0)) {
    return inputAsBn.toFixed(6)
  }

  return value
}

export const disableScrollForNumberInput: WheelEventHandler<
  HTMLInputElement
> = (e) => {
  e.currentTarget.blur()
}
