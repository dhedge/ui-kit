import {
  useOnTokenSelector,
  useTradingPanelPoolConfigs,
} from '@dhedge/core-ui-kit/hooks/state'

export interface TokenSelectorProps {
  symbol: string
}

export const useTokenSelector = ({ symbol }: TokenSelectorProps) => {
  const poolConfigs = useTradingPanelPoolConfigs()

  const isProduct = poolConfigs.some((config) => config.symbol === symbol)
  const isAllSymbol = symbol === 'all'
  const onTokenSelector = useOnTokenSelector()

  const handleTokenClick = () => {
    onTokenSelector?.({ isOpen: true, entity: isProduct ? 'pool' : 'token' })
  }

  return {
    isAllSymbol,
    onClick: handleTokenClick,
  }
}
