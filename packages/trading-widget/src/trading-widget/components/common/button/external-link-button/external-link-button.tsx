import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

interface ExternalLinkButtonProps {
  link: string
  className?: string
  iconClassName?: string
  showDefaultIcon?: boolean
}

export const ExternalLinkButton: FC<
  PropsWithChildren<ExternalLinkButtonProps>
> = ({
  link,
  className,
  children,
  iconClassName = 'dtw-h-5 dtw-w-5',
  showDefaultIcon = true,
}) => (
  <a
    className={classNames(
      'dtw-inline-flex dtw-cursor-pointer dtw-items-center dtw-gap-x-1 dtw-drop-shadow-md hover:dtw-border-themeGray-600 !dtw-text-[color:var(--panel-meta-link-color,var(--panel-content-color))]',
      className,
    )}
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    {children}
    {showDefaultIcon && <ArrowTopRightOnSquareIcon className={iconClassName} />}
  </a>
)
