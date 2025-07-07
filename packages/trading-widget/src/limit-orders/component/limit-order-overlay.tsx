import type { FC } from 'react'
import { useMemo } from 'react'

import { LimitOrderContent } from 'limit-orders/component/limit-order-content'
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
import { TranslationProvider } from 'limit-orders/providers/translation-provider'

export type LimitOrderOverlayProps = {
  translation?: TranslationProviderProps['config']
  actions?: LimitOrderCallbacks
  themeConfig?: ThemeProviderConfigProps
  onClose?: () => void
} & Pick<LimitOrderState, 'vaultAddress' | 'vaultChainId' | 'pricingAsset'> &
  Partial<Pick<LimitOrderState, 'minAmountInUsd'>>

const LimitOrderOverlayContent: FC<
  Pick<LimitOrderOverlayProps, 'themeConfig' | 'onClose'>
> = ({ themeConfig, onClose }) => {
  useListenLimitOrderExecution()

  return (
    <ThemeProvider config={themeConfig}>
      <LimitOrderContent onClose={onClose} hideDeleteButton />
    </ThemeProvider>
  )
}

export const LimitOrderOverlay: FC<LimitOrderOverlayProps> = ({
  vaultChainId,
  vaultAddress,
  pricingAsset,
  translation,
  minAmountInUsd = DEFAULT_MIN_ORDER_AMOUNT,
  actions,
  themeConfig,
  onClose,
}) => {
  const initialState = useMemo(
    () => ({
      vaultAddress,
      vaultChainId,
      pricingAsset,
      minAmountInUsd,
    }),
    [vaultAddress, vaultChainId, pricingAsset, minAmountInUsd],
  )
  return (
    <TranslationProvider config={translation}>
      <LimitOrderStateProvider initialState={initialState} actions={actions}>
        <LimitOrderOverlayContent themeConfig={themeConfig} onClose={onClose} />
      </LimitOrderStateProvider>
    </TranslationProvider>
  )
}
