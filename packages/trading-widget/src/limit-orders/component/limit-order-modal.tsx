import type { FC, PropsWithChildren, ReactNode } from 'react'
import { useCallback, useMemo } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { ModalContent } from 'limit-orders/component/common/modal-content'
import { ModalDialog } from 'limit-orders/component/common/modal-dialog'
import { InputGroup } from 'limit-orders/component/input-group/input-group'
import { LimitOrderApproveButton } from 'limit-orders/component/limit-order-button/limit-order-approve-button'
import { LimitOrderButton } from 'limit-orders/component/limit-order-button/limit-order-button'
import { LimitOrderDeleteButton } from 'limit-orders/component/limit-order-button/limit-order-delete-button'
import { NetworkCheckButton } from 'limit-orders/component/limit-order-button/network-check-button'
import { useLimitOrderModal } from 'limit-orders/component/limit-order-modal.hooks'
import { DEFAULT_MIN_ORDER_AMOUNT } from 'limit-orders/constants'
import { useListenLimitOrderExecution } from 'limit-orders/hooks/use-listen-limit-order-execution'
import { LimitOrderStateProvider } from 'limit-orders/providers/state-provider/state-provider'
import type {
  LimitOrderCallbacks,
  LimitOrderState,
} from 'limit-orders/providers/state-provider/state-provider.types'
import type { ThemeProviderConfigProps } from 'limit-orders/providers/theme-provider'
import { ThemeProvider } from 'limit-orders/providers/theme-provider'
import type { TranslationProviderProps } from 'limit-orders/providers/translation-provider'
import {
  TranslationProvider,
  useTranslationContext,
} from 'limit-orders/providers/translation-provider'

export type LimitOrderModalProps = {
  translation?: TranslationProviderProps['config']
  children: (args: {
    onClick: () => void
    isTransactionPending: boolean
  }) => ReactNode
  actions?: LimitOrderCallbacks
  themeConfig?: ThemeProviderConfigProps
} & Pick<
  LimitOrderState,
  'vaultAddress' | 'vaultChainId' | 'pricingAsset'
> &
  Partial<Pick<LimitOrderState, 'minAmountInUsd' | 'isModalOpen'>>

const LimitOrderModalContent: FC<
  Pick<LimitOrderModalProps, 'children' | 'themeConfig'>
> = ({ children, themeConfig }) => {
  const { onOpen, isModalOpen, onClose, isTransactionPending } =
    useLimitOrderModal()
  const t = useTranslationContext()
  useListenLimitOrderExecution()
  const ConfiguredThemeProvider = useCallback(
    ({ children }: PropsWithChildren) => (
      <ThemeProvider config={themeConfig}>{children}</ThemeProvider>
    ),
    [themeConfig],
  )

  return (
    <>
      {children({ onClick: onOpen, isTransactionPending })}

      <ModalDialog
        isOpen={isModalOpen}
        onClose={onClose}
        ThemeProvider={ConfiguredThemeProvider}
        className="limit-order"
      >
        <ModalContent
          title={t.limitOrdersTitle}
          className="dtw-text-[color:var(--limit-order-content-color)] dtw-text-[length:var(--limit-order-font-size)] dtw-max-w-[430px]"
        >
          <div className="dtw-flex dtw-flex-col dtw-gap-2">
            <InputGroup />
            <NetworkCheckButton>
              <LimitOrderApproveButton>
                <LimitOrderButton />
              </LimitOrderApproveButton>
              <LimitOrderDeleteButton />
            </NetworkCheckButton>
            <ActionButton highlighted={false} onClick={onClose}>
              {t.cancel}
            </ActionButton>
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
  translation,
  minAmountInUsd = DEFAULT_MIN_ORDER_AMOUNT,
  actions,
  themeConfig,
  isModalOpen,
}) => {
  const initialState = useMemo(
    () => ({
      vaultAddress,
      vaultChainId,
      pricingAsset,
      minAmountInUsd,
      isModalOpen,
    }),
    [
      vaultAddress,
      vaultChainId,
      pricingAsset,
      minAmountInUsd,
      isModalOpen,
    ],
  )
  return (
    <TranslationProvider config={translation}>
      <LimitOrderStateProvider initialState={initialState} actions={actions}>
        <LimitOrderModalContent themeConfig={themeConfig}>
          {children}
        </LimitOrderModalContent>
      </LimitOrderStateProvider>
    </TranslationProvider>
  )
}
