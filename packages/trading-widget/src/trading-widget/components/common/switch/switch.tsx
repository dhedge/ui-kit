import { Field, Switch as HeadlessSwitch, Label } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

interface SwitchProps {
  defaultEnabled?: boolean
  onChange?: (enabled: boolean) => void
  disabled?: boolean
  label?: string
  vertical?: boolean
  size?: 'xs' | 'sm'
}

export const Switch = ({
  defaultEnabled = false,
  onChange,
  disabled = false,
  label,
  vertical = false,
}: SwitchProps) => {
  const [checked, setChecked] = useState(defaultEnabled)

  useEffect(() => {
    setChecked(defaultEnabled)
  }, [defaultEnabled])

  const onSwitchChange = (enabled: boolean) => {
    if (!disabled) {
      setChecked(enabled)
      onChange?.(enabled)
    }
  }

  return (
    <Field>
      <div
        className={classNames('dtw-flex', {
          'dtw-flex-col dtw-gap-y-0.5': vertical,
          'dtw-items-center': !vertical,
        })}
      >
        <HeadlessSwitch
          checked={checked}
          onChange={onSwitchChange}
          className={classNames(
            'dtw-p-0 dtw-relative dtw-inline-flex dtw-h-6 dtw-w-11 dtw-flex-shrink-0 dtw-items-center dtw-rounded-full dtw-transition-colors focus:dtw-outline-none',
            {
              '!dtw-bg-[color:var(--panel-switch-bg-checked)]': checked,
              '!dtw-bg-[color:var(--panel-switch-bg)]': !checked,
              'dtw-pointer-events-none dtw-opacity-50': disabled,
            },
          )}
        >
          <span
            className={classNames(
              'dtw-inline-block dtw-h-4 dtw-w-4 dtw-transform dtw-rounded-full dtw-bg-white dtw-transition-transform',
              {
                'dtw-translate-x-6': checked,
                'dtw-translate-x-1': !checked,
              },
            )}
          />
        </HeadlessSwitch>
        {label && (
          <Label
            className={classNames('dtw-cursor-pointer dtw-text-xs', {
              'dtw-ml-2': !vertical,
            })}
          >
            {label}
          </Label>
        )}
      </div>
    </Field>
  )
}
