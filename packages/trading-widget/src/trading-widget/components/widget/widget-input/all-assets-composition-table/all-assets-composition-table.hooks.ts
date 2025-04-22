import {
  AddressZero,
  DEFAULT_VISIBLE_ASSETS_LIMIT,
  FLAT_MONEY_UNIT_ADDRESSES,
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
  const composition = usePoolCompositionWithFraction({
    vaultTokensAmount: value,
    address,
    chainId,
  })
  const visibleAssetsLimit = showAllAsset
    ? composition.length
    : DEFAULT_VISIBLE_ASSETS_LIMIT

  const unitAsset = composition.find(({ tokenAddress }) =>
    FLAT_MONEY_UNIT_ADDRESSES.some((unit) =>
      isEqualAddress(tokenAddress, unit),
    ),
  )
  const showUnitWithdrawalTip = !!unitAsset && unitAsset.amount !== '0'

  const { firstPart: visibleAssets, secondPart: hiddenAssets } = sliceByIndex(
    composition,
    visibleAssetsLimit,
  )

  return {
    visibleAssets,
    hiddenAssets,
    showUnitWithdrawalTip,
    unitSymbol: unitAsset?.tokenName,
    unitAddress: unitAsset?.tokenAddress ?? AddressZero,
    address,
  }
}
