import { useCallback } from 'react'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useTradingPanelModal,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { formatToUsd } from 'core-kit/utils'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

const getTxHashShort = (link: string | undefined) => {
  if (!link) {
    return undefined
  }
  const match = link.match(/0x[a-fA-F0-9]{64}/)
  if (!match) {
    return undefined
  }
  const hash = match[0]
  return `${hash.slice(0, 4)}...${hash.slice(-3)}`
}

export const useSuccessDepositOverlay = ({ type }: OverlayProps) => {
  const { address, symbol, chainId } = useTradingPanelPoolConfig()
  const [{ link, sendTokens }, updateTradingModal] = useTradingPanelModal()
  const { handleReject } = useOverlayHandlers({ type })
  const paidToken = sendTokens?.[0]

  const txHash = getTxHashShort(link)

  const vaultTokenPrice = usePoolTokenPrice({
    address,
    chainId,
  })

  const onClose = useCallback(() => {
    updateTradingModal({ isOpen: false })
    handleReject()
  }, [updateTradingModal, handleReject])

  return {
    onClose,
    link,
    vaultSymbol: symbol,
    paidToken,
    txHash,
    vaultTokenPrice: formatToUsd({ value: vaultTokenPrice }),
  }
}
