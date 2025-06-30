import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type InputNumberProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string
  onChange?: (formatted: string, raw: string) => void
  formatOnBlurOnly?: boolean
  allowNegative?: boolean
}

const formatNumber = (
  input: string,
  allowNegative: boolean = false,
): string => {
  if (!input) return ''

  let sign = ''
  if (allowNegative && input.startsWith('-')) {
    sign = '-'
    input = input.slice(1)
  }

  const [intPart, decimalPart] = input.split('.')
  const cleanedInt = intPart?.replace(/\D/g, '')

  if (!cleanedInt) return decimalPart ? `${sign}0.${decimalPart}` : sign

  const formattedInt = new Intl.NumberFormat().format(Number(cleanedInt))
  return decimalPart !== undefined
    ? `${sign}${formattedInt}.${decimalPart.replace(/[^\d]/g, '')}`
    : `${sign}${formattedInt}`
}

const extractRawValue = (formatted: string): string => {
  return formatted.replace(/,/g, '')
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      onChange,
      formatOnBlurOnly = false,
      allowNegative = false,
      ...rest
    },
    ref,
  ) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      const cleaned = raw
        .replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, '')
        .replace(/^(-?\d*\.\d*).*$/, '$1')
        .replace(/^(-?\.)(.*)/, '$1$2')

      if (formatOnBlurOnly) {
        onChange?.(cleaned, extractRawValue(cleaned))
      } else {
        const formatted = formatNumber(cleaned, allowNegative)
        onChange?.(formatted, extractRawValue(formatted))
      }
    }

    const handleBlur = () => {
      if (!formatOnBlurOnly) return
      const formatted = formatNumber(value, allowNegative)
      onChange?.(formatted, extractRawValue(formatted))
    }

    return (
      <input
        {...rest}
        ref={ref}
        type="text"
        inputMode="decimal"
        value={formatNumber(value, allowNegative)}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
    )
  },
)

InputNumber.displayName = 'InputNumber'
