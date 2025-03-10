import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

import type { Address } from 'core-kit/types'
import { ModalContent } from 'limit-orders/component/common/modal-content'
import { ModalDialog } from 'limit-orders/component/common/modal-dialog'
import { InputGroup } from 'limit-orders/component/input-group/input-group'
import { LimitOrderButton } from 'limit-orders/component/limit-order-button/limit-order-button'
import { useLimitOrderModal } from 'limit-orders/component/limit-order-modal.hooks'
import { useListenLimitOrderExecution } from 'limit-orders/hooks/use-listen-limit-order-execution'
import { LimitOrderStateProvider } from 'limit-orders/providers/state-provider/state-provider'
import type { LimitOrderCallbacks } from 'limit-orders/providers/state-provider/state-provider.types'
import { ThemeProvider } from 'limit-orders/providers/theme-provider'

interface LimitOrderModalProps {
  children: (args: {
    onClick: () => void
    isTransactionPending: boolean
  }) => ReactNode
  vaultAddress: Address
  vaultChainId: number
  pricingAsset: Address
  actions?: LimitOrderCallbacks
}

const LimitOrderModalContent: FC<Pick<LimitOrderModalProps, 'children'>> = ({
  children,
}) => {
  const { onOpen, isModalOpen, onClose, isTransactionPending } =
    useLimitOrderModal()
  useListenLimitOrderExecution()

  return (
    <>
      {children({ onClick: onOpen, isTransactionPending })}

      <ModalDialog
        isOpen={isModalOpen}
        onClose={onClose}
        ThemeProvider={ThemeProvider}
        className="limit-order"
      >
        <ModalContent
          title="Set limit orders"
          className="dtw-text-[color:var(--limit-order-content-color)]"
        >
          <div className="dtw-flex dtw-flex-col dtw-gap-3">
            <InputGroup />
            <LimitOrderButton />
          </div>
        </ModalContent>
      </ModalDialog>
    </>
  )
}

export const LimitOrderModal: FC<LimitOrderModalProps> = ({
  children,
  vaultChainId,
  vaultAddress,
  pricingAsset,
  actions,
}) => {
  const initialState = useMemo(
    () => ({ vaultAddress, vaultChainId, pricingAsset }),
    [vaultAddress, vaultChainId, pricingAsset],
  )
  return (
    <LimitOrderStateProvider initialState={initialState} actions={actions}>
      <LimitOrderModalContent>{children}</LimitOrderModalContent>
    </LimitOrderStateProvider>
  )
}
