import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
import { Fragment, useRef } from 'react'

import { IconButton } from 'trading-widget/components/common'

export interface BaseDialogProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  ThemeProvider?: FC
  className?: string
}

export const ModalDialog: FC<BaseDialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
  ThemeProvider = Fragment,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog
      open={isOpen}
      initialFocus={dialogRef}
      as="div"
      className={classNames(
        'dtw-relative dtw-z-20 dtw-overflow-y-auto',
        className,
      )}
      onClose={onClose}
    >
      <ThemeProvider>
        <>
          <DialogBackdrop className="dtw-fixed dtw-inset-0 dtw-backdrop-blur-md dtw-backdrop-brightness-75 dtw-backdrop-filter" />
          <div
            className="dtw-fixed dtw-inset-0 dtw-flex dtw-w-screen dtw-items-center dtw-justify-center dtw-p-4"
            ref={dialogRef}
          >
            <DialogPanel
              transition
              className="dtw-inline-block dtw-transform dtw-duration-100 dtw-ease-out dtw-overflow-hidden dtw-rounded-2xl dtw-text-left dtw-align-middle dtw-shadow-xl data-[closed]:dtw-opacity-0 data-[closed]:dtw-scale-75"
            >
              {children}
              <div className="dtw-absolute dtw-top-3 dtw-right-3 dtw-text-[color:var(--limit-order-content-color)] ">
                <IconButton Icon={XMarkIcon} onClick={onClose} />
              </div>
            </DialogPanel>
          </div>
        </>
      </ThemeProvider>
    </Dialog>
  )
}
