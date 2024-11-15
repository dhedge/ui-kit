import { useEffect, useState } from 'react'

import { SWAP_QUOTE_REFRESH_INTERVAL } from 'core-kit/const'

export interface ReloadButtonProps {
  onClick: () => void
  disabled?: boolean
  tooltipText: string
}

export const useReloadButton = ({
  onClick,
  tooltipText,
  disabled,
}: ReloadButtonProps) => {
  const [disabledByTimer, setDisabledByTimer] = useState(false)

  const handleClick = () => {
    onClick()
    setDisabledByTimer(true)
  }

  useEffect(() => {
    if (!disabledByTimer) return

    const timer = setTimeout(() => {
      setDisabledByTimer(false)
    }, SWAP_QUOTE_REFRESH_INTERVAL)

    return () => clearTimeout(timer)
  }, [disabledByTimer])

  return { disabled: disabled || disabledByTimer, tooltipText, handleClick }
}
