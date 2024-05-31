import type { TradingToken } from 'core-kit/types'

export interface MultiTokenSelectItemProps {
  token: TradingToken
  onSelect: (token: TradingToken) => void
}

export const useMultiTokenSelectItem = ({
  token,
  onSelect,
}: MultiTokenSelectItemProps) => {
  const handleOptionSelect = () => {
    onSelect(token)
  }

  return {
    onClick: handleOptionSelect,
  }
}
