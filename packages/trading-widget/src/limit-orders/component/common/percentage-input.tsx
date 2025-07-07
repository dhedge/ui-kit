import type { ChangeEvent, FC, ReactNode } from 'react'
import { useRef, useState } from 'react'

export interface PercentageInputProps {
  inputValue: string
  onInputChange?: (value: string) => void
  autoFocus?: boolean
  disabled?: boolean
  placeholder?: string
  suffix?: string
  postfix?: ReactNode
}

const MAX_PERCENTAGE = 100
const MAX_LENGTH = 3

export const usePercentageInput = ({
  inputValue = '',
  onInputChange,
  autoFocus = false,
}: PercentageInputProps) => {
  const [displayValue, setDisplayValue] = useState(inputValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')

    if (value.length > MAX_LENGTH) return

    const numValue = Number(value)
    if (!isNaN(numValue) && numValue <= MAX_PERCENTAGE) {
      setDisplayValue(value)
      onInputChange?.(value)
    }
  }

  return {
    inputRef,
    value: displayValue,
    autoFocus,
    onContainerClick: handleContainerClick,
    onInputChange: handleInputChange,
  }
}

export const PercentageInput: FC<PercentageInputProps> = (props) => {
  const { disabled, placeholder, suffix = '%', postfix } = props
  const { inputRef, autoFocus, value, onContainerClick, onInputChange } =
    usePercentageInput(props)

  return (
    <div
      className="dtw-flex dtw-flex-col dtw-gap-[var(--limit-order-input-group-gap,var(--limit-order-gap))] dtw-border-[var(--limit-order-input-border-color)] dtw-rounded-[var(--limit-order-input-radius,var(--limit-order-radius))] dtw-border dtw-bg-[var(--limit-order-input-bg,var(--limit-order-neutral-color))] dtw-py-[var(--limit-order-input-py)] dtw-px-[var(--limit-order-input-px)] focus-within:dtw-border-[var(--limit-order-input-focus-border-color)] focus-within:dtw-bg-[var(--limit-order-input-focus-bg)] dtw-shadow-md"
      onClick={onContainerClick}
    >
      <div className="transparent-scrollbar dtw-flex dtw-items-center dtw-gap-1 dtw-text-[color:var(--limit-order-input-content-color,var(--limit-order-secondary-content-color))]">
        {suffix ? (
          <span className="dtw-font-light dtw-whitespace-nowrap dtw-text-[color:var(--limit-order-secondary-content-color)]">
            {suffix}
          </span>
        ) : null}
        <input
          className="dtw-w-full dtw-appearance-none dtw-bg-transparent placeholder:dtw-text-[color:var(--limit-order-input-placeholder-color,var(--limit-order-secondary-content-color))] dtw-text-[length:var(--limit-order-input-font-size,var(--limit-order-font-size-sm))] dtw-leading-[var(--limit-order-input-line-height,var(--limit-order-line-height-sm))] dtw-font-[var(--limit-order-input-font-weight,var(--limit-order-font-weight-light))] dtw-outline-none focus:dtw-outline-none lg:dtw-text-[length:var(--limit-order-input-font-size-lg,var(--limit-order-font-size-lg))] lg:dtw-leading-[var(--limit-order-input-line-height-lg,var(--limit-order-line-height-lg))]"
          ref={inputRef}
          autoFocus={autoFocus}
          type="text"
          min={0}
          value={value}
          onChange={onInputChange}
          disabled={disabled}
          placeholder={placeholder}
        />
        <div className="dtw-font-light dtw-text-[length:var(--limit-order-input-suffix-font-size,var(--limit-order-font-size-sm))] dtw-text-[color:var(--limit-order-secondary-content-color)]">
          {postfix}
        </div>
      </div>
    </div>
  )
}
