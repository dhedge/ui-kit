import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

import { ModalContent } from 'limit-orders/component/common/modal-content'
import { ModalDialog } from 'limit-orders/component/common/modal-dialog'
import { InputGroup } from 'limit-orders/component/input-group/input-group'
import { LimitOrderApproveButton } from 'limit-orders/component/limit-order-button/limit-order-approve-button'
import { LimitOrderButton } from 'limit-orders/component/limit-order-button/limit-order-button'
import { NetworkCheckButton } from 'limit-orders/component/limit-order-button/network-check-button'
import { useLimitOrderModal } from 'limit-orders/component/limit-order-modal.hooks'
import { useListenLimitOrderExecution } from 'limit-orders/hooks/use-listen-limit-order-execution'
import { LimitOrderStateProvider } from 'limit-orders/providers/state-provider/state-provider'
import type {
  LimitOrderCallbacks,
  LimitOrderState,
} from 'limit-orders/providers/state-provider/state-provider.types'
import { ThemeProvider } from 'limit-orders/providers/theme-provider'

type LimitOrderModalProps = {
  children: (args: {
    onClick: () => void
    isTransactionPending: boolean
  }) => ReactNode
  actions?: LimitOrderCallbacks
} & Pick<
  LimitOrderState,
  'vaultAddress' | 'vaultChainId' | 'pricingAsset' | 'isReversedOrder'
>

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
          className="dtw-text-[color:var(--limit-order-content-color)] dtw-max-w-[430px]"
        >
          <div className="dtw-flex dtw-flex-col dtw-gap-3">
            <InputGroup />
            <NetworkCheckButton>
              <LimitOrderApproveButton>
                <LimitOrderButton />
              </LimitOrderApproveButton>
            </NetworkCheckButton>
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
  isReversedOrder = false,
  actions,
}) => {
  const initialState = useMemo(
    () => ({ vaultAddress, vaultChainId, pricingAsset, isReversedOrder }),
    [vaultAddress, vaultChainId, pricingAsset, isReversedOrder],
  )
  return (
    <LimitOrderStateProvider initialState={initialState} actions={actions}>
      <LimitOrderModalContent>{children}</LimitOrderModalContent>
    </LimitOrderStateProvider>
  )
}
