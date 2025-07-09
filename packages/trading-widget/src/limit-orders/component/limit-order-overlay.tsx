import type { FC } from 'react'
import { useMemo } from 'react'

import { LimitOrderContent } from 'limit-orders/component/limit-order-content'
import { DEFAULT_MIN_ORDER_AMOUNT } from 'limit-orders/constants'
import { useExistingLimitOrderDefaultPrices } from 'limit-orders/hooks/use-existing-limit-order-default-prices'
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
} & Pick<LimitOrderState, 'vaultAddress' | 'vaultChainId' | 'pricingAsset'> &
  Partial<Pick<LimitOrderState, 'minAmountInUsd'>>

const LimitOrderOverlayContent: FC<
  Pick<LimitOrderOverlayProps, 'themeConfig'>
> = ({ themeConfig }) => {
  useListenLimitOrderExecution()

  return (
    <ThemeProvider config={themeConfig}>
      <LimitOrderContent hideDeleteButton />
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
}) => {
  const { isFetched, upperLimitPrice, lowerLimitPrice } =
    useExistingLimitOrderDefaultPrices({ vaultAddress, vaultChainId })
  const initialState = useMemo(
    () => ({
      vaultAddress,
      vaultChainId,
      pricingAsset,
      minAmountInUsd,
      form: {
        upperLimitPrice,
        lowerLimitPrice,
      },
    }),
    [
      vaultAddress,
      vaultChainId,
      pricingAsset,
      minAmountInUsd,
      upperLimitPrice,
      lowerLimitPrice,
    ],
  )

  if (!isFetched) {
    return null
  }

  return (
    <TranslationProvider config={translation}>
      <LimitOrderStateProvider initialState={initialState} actions={actions}>
        <LimitOrderOverlayContent themeConfig={themeConfig} />
      </LimitOrderStateProvider>
    </TranslationProvider>
  )
}
