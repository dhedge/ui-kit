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
      'dtw-relative dtw-flex dtw-flex-col dtw-gap-4 dtw-rounded-xl dtw-px-5 dtw-py-8 dtw-w-full md:dtw-min-w-[25rem] md:dtw-max-w-[30rem] dtw-bg-[var(--limit-order-background-color)]',
      className,
    )}
  >
    {title && (
      <h1
        className={classNames(
          'dtw-mb-6 dtw-text-lg dtw-font-semibold dtw-drop-shadow-md dtw-text-[color:var(--limit-order-secondary-content-color)]',
          titleClassName,
        )}
      >
        {title}
      </h1>
    )}
    <div className="dtw-w-full">{children}</div>
  </div>
)
