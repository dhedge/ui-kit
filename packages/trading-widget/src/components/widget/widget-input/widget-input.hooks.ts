import type { ChangeEvent } from 'react'
import { useMemo, useRef } from 'react'
import {
  formatToUsd,
  getConventionalTokenPriceDecimals,
} from '@dhedge/core-ui-kit/utils'

import { THEME_TYPE, ThemeType } from 'types'

import { formatInputValue } from './widget-input.utils'

export interface WidgetInputProps {
  label: string
  assetSymbol: string
  assetPrice: string
  assetInput: string
  onInputChange?: (value: string) => void
  onInputFocus?: () => void
  autoFocus?: boolean
  disabled?: boolean
  displayMax?: boolean
  maxBalance?: string
  displayCalculatedValue?: boolean
  tradingPriceDiff?: number
  type?: ThemeType
  isLoading?: boolean
}

export const useWidgetInput = ({
  displayCalculatedValue,
  assetInput = '',
  assetPrice,
  tradingPriceDiff = 0,
  type,
  onInputChange,
  maxBalance,
  autoFocus = false,
  disabled = false,
}: WidgetInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const usdAmount = useMemo<string>(() => {
    if (!displayCalculatedValue) {
      return ''
    }
    const amount = Number(assetInput || 0) * Number(assetPrice || 0)
    const amountInUsd = formatToUsd({
      value: amount,
      maximumFractionDigits: getConventionalTokenPriceDecimals(amount),
    })
    if (tradingPriceDiff) {
      return `${amountInUsd} (${tradingPriceDiff}% ${
        type === THEME_TYPE.ERROR ? '\u{26A0}' : ''
      })`
    }
    return amountInUsd
  }, [assetInput, assetPrice, tradingPriceDiff, displayCalculatedValue, type])

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onInputChange) {
      onInputChange(e.target.value)
    }
  }

  const handleMaxBalanceClick = () => {
    if (onInputChange && maxBalance) {
      onInputChange(maxBalance)
    }
  }

  return {
    inputRef,
    usdAmount,
    value: formatInputValue(assetInput, disabled),
    autoFocus,
    onContainerClick: handleContainerClick,
    onMaxBalanceClick: handleMaxBalanceClick,
    onInputChange: handleInputChange,
  }
}
