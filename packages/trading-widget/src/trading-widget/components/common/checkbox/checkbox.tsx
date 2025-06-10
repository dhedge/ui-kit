import type { FC } from 'react'

import type { CheckboxProps } from 'trading-widget/providers/component-provider'

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  className,
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className={className}
  />
)
