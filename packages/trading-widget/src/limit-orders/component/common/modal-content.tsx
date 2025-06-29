import classNames from 'classnames'
import type { FC, PropsWithChildren, ReactNode } from 'react'

export interface ModalContentProps {
  title?: string
  subtitle?: ReactNode
  className?: string
  titleClassName?: string
}

export const ModalContent: FC<PropsWithChildren<ModalContentProps>> = ({
  title,
  children,
  className,
  titleClassName,
}) => (
  <div
    className={classNames(
      'dtw-relative dtw-flex dtw-flex-col dtw-gap-4 dtw-rounded-xl dtw-p-3 dtw-w-full dtw-bg-[var(--limit-order-background-color)]',
      className,
    )}
  >
    {title && (
      <h1
        className={classNames(
          'dtw-mb-6 !dtw-text-[length:var(--limit-order-font-size-lg)] dtw-drop-shadow-md dtw-text-[color:var(--limit-order-secondary-content-color)]',
          titleClassName,
        )}
      >
        {title}
      </h1>
    )}
    <div className="dtw-w-full">{children}</div>
  </div>
)
