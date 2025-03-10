import type { ChangeEvent, FC } from 'react'

import { useRef } from 'react'

export interface PriceInputProps {
  label: string
  inputValue: string
  onInputChange?: (value: string) => void
  autoFocus?: boolean
  disabled?: boolean
  placeholder?: string
  price?: string | null
}

export const usePriceInput = ({
  inputValue = '',
  onInputChange,
  autoFocus = false,
}: PriceInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onInputChange) {
      onInputChange(e.target.value)
    }
  }

  return {
    inputRef,
    value: inputValue,
    autoFocus,
    onContainerClick: handleContainerClick,
    onInputChange: handleInputChange,
  }
}

export const PriceInput: FC<PriceInputProps> = (props) => {
  const { label, disabled, placeholder, price } = props
  const { inputRef, autoFocus, value, onContainerClick, onInputChange } =
    usePriceInput(props)

  return (
    <div
      className="dtw-flex dtw-flex-col dtw-gap-[var(--limit-order-input-group-gap,var(--limit-order-gap))] dtw-border-[var(--limit-order-input-border-color)] dtw-rounded-[var(--limit-order-input-radius,var(--limit-order-radius))] dtw-border dtw-bg-[var(--limit-order-input-bg,var(--limit-order-neutral-color))] dtw-py-[var(--limit-order-input-py)] dtw-px-[var(--limit-order-input-px)] focus-within:dtw-border-[var(--limit-order-input-focus-border-color)] focus-within:dtw-bg-[var(--limit-order-input-focus-bg)] dtw-shadow-md"
      onClick={onContainerClick}
    >
      <div className="dtw-flex dtw-justify-between dtw-text-[length:var(--limit-order-input-label-font-size,var(--limit-order-font-size-sm))] dtw-leading-[var(--limit-order-input-label-line-height,var(--limit-order-line-height-sm))] dtw-font-[var(--limit-order-input-label-font-weight,var(--limit-order-font-weight-light))] dtw-gap-x-2">
        <span>{label}</span>
        {price ? (
          <span className="dtw-text-xs">Mark price: {price}</span>
        ) : null}
      </div>
      <div className="transparent-scrollbar dtw-flex dtw-items-center dtw-text-[color:var(--limit-order-input-content-color,var(--limit-order-secondary-content-color))]">
        <span className="dtw-absolute dtw-text-[length:var(--limit-order-input-font-size,var(--limit-order-font-size-sm))] dtw-leading-[var(--limit-order-input-line-height,var(--limit-order-line-height-sm))] dtw-font-[var(--limit-order-input-font-weight,var(--limit-order-font-weight-light))] dtw-outline-none focus:dtw-outline-none lg:dtw-text-[length:var(--limit-order-input-font-size-lg,var(--limit-order-font-size-lg))] lg:dtw-leading-[var(--limit-order-input-line-height-lg,var(--limit-order-line-height-lg))]">
          $
        </span>
        <input
          className="dtw-pl-3 dtw-appearance-none dtw-bg-transparent placeholder:dtw-text-[color:var(--limit-order-input-placeholder-color,var(--limit-order-secondary-content-color))] dtw-text-[length:var(--limit-order-input-font-size,var(--limit-order-font-size-sm))] dtw-leading-[var(--limit-order-input-line-height,var(--limit-order-line-height-sm))] dtw-font-[var(--limit-order-input-font-weight,var(--limit-order-font-weight-light))] dtw-outline-none focus:dtw-outline-none lg:dtw-text-[length:var(--limit-order-input-font-size-lg,var(--limit-order-font-size-lg))] lg:dtw-leading-[var(--limit-order-input-line-height-lg,var(--limit-order-line-height-lg))] dtw-w-full"
          ref={inputRef}
          autoFocus={autoFocus}
          type="number"
          min={0}
          value={value}
          onChange={onInputChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
