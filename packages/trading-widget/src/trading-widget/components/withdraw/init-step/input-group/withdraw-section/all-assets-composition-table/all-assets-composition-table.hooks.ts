import {
  DEFAULT_VISIBLE_ASSETS_LIMIT,
  FLATMONEY_UNIT_ADDRESS_MAP,
} from 'core-kit/const'
import { usePoolCompositionWithFraction } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'

import { isEqualAddress, sliceByIndex } from 'core-kit/utils'
import type { TokenIconSize } from 'trading-widget/types'

export interface AllAssetsCompositionTableProps {
  className?: string
  showFraction?: boolean
  iconSize?: TokenIconSize
  showAllAsset?: boolean
}

export const useAllAssetsCompositionTable = (
  showAllAsset: AllAssetsCompositionTableProps['showAllAsset'],
) => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [{ value }] = useSendTokenInput()
  const poolComposition = usePoolCompositionWithFraction({
    vaultTokensAmount: value,
    address,
    chainId,
  })
  const visibleAssetsLimit = showAllAsset
    ? poolComposition.length
    : DEFAULT_VISIBLE_ASSETS_LIMIT

  const showUnitWithdrawalTip = poolComposition.some(
    ({ tokenAddress, amount }) =>
      isEqualAddress(tokenAddress, FLATMONEY_UNIT_ADDRESS_MAP[chainId] ?? '') &&
      amount !== '0',
  )

  const { firstPart: visibleAssets, secondPart: hiddenAssets } = sliceByIndex(
    poolComposition,
    visibleAssetsLimit,
  )

  return {
    visibleAssets,
    hiddenAssets,
    chainId,
    showUnitWithdrawalTip,
    address,
  }
}
