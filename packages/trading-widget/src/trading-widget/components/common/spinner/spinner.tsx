import classNames from 'classnames'
import type { FC } from 'react'

import type { ThemeType } from 'trading-widget/types'
import { THEME_TYPE } from 'trading-widget/types'

interface SpinnerProps {
  type?: ThemeType
  className?: string
}

export const Spinner: FC<SpinnerProps> = ({
  type = THEME_TYPE.SUCCESS,
  className,
}) => {
  return (
    <svg
      className={classNames(
        'dtw-animate-spin',
        {
          'dtw-stroke-themeGreen': type === THEME_TYPE.SUCCESS,
          'dtw-stroke-[color:var(--panel-accent-content-color)]':
            type === THEME_TYPE.DEFAULT,
        },
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
