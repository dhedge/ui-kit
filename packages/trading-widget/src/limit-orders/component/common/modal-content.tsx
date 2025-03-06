import classNames from 'classnames'
import type { FC, PropsWithChildren, ReactElement, ReactNode } from 'react'

export interface ModalContentProps {
  title?: string
  subtitle?: ReactNode
  Icon?: ReactElement
  className?: string
  titleClassName?: string
}

export const ModalContent: FC<PropsWithChildren<ModalContentProps>> = ({
  title,
  subtitle,
  Icon,
  children,
  className,
  titleClassName,
}) => (
  <div
    className={classNames(
      'modal-container dtw-w-full md:dtw-w-[25rem] dtw-gap-4',
      className,
    )}
  >
    {title && (
      <h1 className={classNames('modal-title', titleClassName)}>{title}</h1>
    )}
    {Icon}
    {subtitle && (
      <div className="modal-subtitle dtw-max-h-36 dtw-overflow-y-scroll dtw-break-all">
        {subtitle}
      </div>
    )}
    <div className="dtw-w-full">{children}</div>
  </div>
)
