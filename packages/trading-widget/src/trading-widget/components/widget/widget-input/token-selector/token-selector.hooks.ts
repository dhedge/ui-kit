import {
  useOnTokenSelector,
  useTradingPanelPoolConfigs,
} from 'core-kit/hooks/state'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export interface TokenSelectorProps {
  symbol: string
}

export const useTokenSelector = ({ symbol }: TokenSelectorProps) => {
  const poolConfigs = useTradingPanelPoolConfigs()
  const dispatch = useOverlayDispatchContext()
  const { standalone } = useConfigContextParams()

  const isProduct = poolConfigs.some((config) => config.symbol === symbol)
  const isAllSymbol = symbol === 'all'
  const onTokenSelector = useOnTokenSelector()
  const disabled = isProduct && poolConfigs.length === 1
  const hideTokenIcon = standalone && isProduct

  const handleTokenClick = () => {
    onTokenSelector?.({ isOpen: true, entity: isProduct ? 'pool' : 'token' })

    if (standalone) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: isProduct ? OVERLAY.POOL_SELECT : OVERLAY.TOKEN_SELECT,
          isOpen: true,
        },
      })
    }
  }

  return {
    isAllSymbol,
    onClick: handleTokenClick,
    disabled,
    hideTokenIcon,
  }
}
