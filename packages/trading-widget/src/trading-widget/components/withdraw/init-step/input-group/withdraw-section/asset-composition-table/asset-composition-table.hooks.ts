import { FLATMONEY_UNIT_ADDRESS_MAP } from 'core-kit/const'
import { usePoolCompositionWithFraction } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'

import { isEqualAddress } from 'core-kit/utils'
import type { TokenIconSize } from 'trading-widget/types'

export interface AssetCompositionTableProps {
  className?: string
  showFraction?: boolean
  iconSize?: TokenIconSize
}

export const useAssetCompositionTable = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [{ value }] = useSendTokenInput()
  const poolComposition = usePoolCompositionWithFraction({
    vaultTokensAmount: value,
    address,
    chainId,
  })
  const showUnitWithdrawalTip = poolComposition.some(
    ({ tokenAddress, amount }) =>
      isEqualAddress(tokenAddress, FLATMONEY_UNIT_ADDRESS_MAP[chainId] ?? '') &&
      amount !== '0',
  )

  return { poolComposition, chainId, showUnitWithdrawalTip, address }
}
