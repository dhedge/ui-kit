import { usePoolCompositionWithFraction } from '@dhedge/core-ui-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from '@dhedge/core-ui-kit/hooks/state'

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

  return { poolComposition }
}
