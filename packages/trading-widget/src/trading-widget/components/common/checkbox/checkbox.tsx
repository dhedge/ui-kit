import type { CheckboxProps } from '@headlessui/react'
import { Checkbox as CheckboxComponent, Field, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'

interface CheckBoxProps extends CheckboxProps {
  label?: ReactNode
  labelClassName?: string
}

export const CheckBox: FC<CheckBoxProps> = ({
  className,
  checked,
  label,
  labelClassName,
  ...props
}) => (
  <Field className="dtw-flex dtw-items-center dtw-gap-2">
    <CheckboxComponent
      {...props}
      checked={checked}
      className={classNames(
        'dtw-group dtw-flex dtw-items-center dtw-justify-center dtw-shrink-0 dtw-size-[var(--panel-checkbox-size)] dtw-rounded-[var(--panel-checkbox-radius)] dtw-p-0.5 dtw-right-0 dtw-outline-0 dtw-cursor-pointer dtw-border',
        {
          'dtw-bg-[color:var(--panel-checkbox-bg-checked)] dtw-border-[color:var(--panel-checkbox-border-color-checked)]':
            checked,
          'dtw-bg-[color:var(--panel-checkbox-bg)] dtw-border-[color:var(--panel-checkbox-border-color)]':
            !checked,
        },
        className,
      )}
    >
      <CheckIcon className="dtw-opacity-0 dtw-size-[var(--panel-checkbox-icon-size)] dtw-fill-[color:var(--panel-checkbox-color)] group-data-[checked]:dtw-opacity-100 dtw-shrink-0" />
    </CheckboxComponent>
    {label && (
      <Label className={classNames('dtw-select-none', labelClassName)}>
        {label}
      </Label>
    )}
  </Field>
)
