import { useMemo } from 'react'

import type { Address } from 'viem'

import {
  useTradingPanelModal,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { getExplorerLink } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

export const useLimitSellsOverlay = ({ type }: OverlayProps) => {
  const { minLimitOrderValue } = useConfigContextParams()
  const { address, chainId, pricingAsset, symbol } = useTradingPanelPoolConfig()
  const { handleReject } = useOverlayHandlers({ type })
  const updateTradingModal = useTradingPanelModal()[1]
  const updatePendingTransactions = useTradingPanelTransactions()[1]

  const actions = useMemo(
    () => ({
      onTransactionSettled: (txHash: Address | undefined) => {
        if (!txHash) {
          return
        }

        handleReject()
        updatePendingTransactions({
          type: 'add',
          txHash,
          action: 'create_limit_sell_order',
          chainId,
          symbol,
        })
        updateTradingModal({
          isOpen: true,
          action: 'create_limit_sell_order',
          status: 'Mining',
          link: txHash
            ? getExplorerLink(txHash, 'transaction', chainId)
            : undefined,
          sendTokens: null,
          receiveTokens: null,
        })
      },
    }),
    [
      chainId,
      handleReject,
      symbol,
      updatePendingTransactions,
      updateTradingModal,
    ],
  )

  return {
    handleReject,
    address,
    chainId,
    pricingAsset,
    minLimitOrderValue,
    actions,
  }
}
