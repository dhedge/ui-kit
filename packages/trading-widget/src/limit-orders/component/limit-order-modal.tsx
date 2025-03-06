import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

import type { Address } from 'core-kit/types'
import { ModalContent } from 'limit-orders/component/common/modal-content'
import { ModalDialog } from 'limit-orders/component/common/modal-dialog'
import { useLimitOrderModal } from 'limit-orders/component/limit-order-modal.hooks'
import { LimitOrderStateProvider } from 'limit-orders/providers/state-provider/state-provider'

interface LimitOrderModalProps {
  children: (onClick: () => void) => ReactNode
  vaultAddress: Address
  vaultChainId: number
}

const LimitOrderModalContent: FC<Pick<LimitOrderModalProps, 'children'>> = ({
  children,
}) => {
  const { onOpen, isModalOpen, onClose } = useLimitOrderModal()
  return (
    <>
      {children(onOpen)}

      <ModalDialog isOpen={isModalOpen} onClose={onClose}>
        <ModalContent title="Limit Orders">TBD</ModalContent>
      </ModalDialog>
    </>
  )
}

export const LimitOrderModal: FC<LimitOrderModalProps> = ({
  children,
  vaultChainId,
  vaultAddress,
}) => {
  const initialState = useMemo(
    () => ({ vaultAddress, vaultChainId }),
    [vaultAddress, vaultChainId],
  )
  return (
    <LimitOrderStateProvider initialState={initialState}>
      <LimitOrderModalContent>{children}</LimitOrderModalContent>
    </LimitOrderStateProvider>
  )
}
