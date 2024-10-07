import { CircleStackIcon } from '@heroicons/react/20/solid'

import { TokenBadge } from 'trading-widget/components/common'

import type { MultiTokenSelectItemProps } from './multi-token-select-item.hooks'
import { useMultiTokenSelectItem } from './multi-token-select-item.hooks'

import { AssetCompositionTable } from '../../../../withdraw/unroll-step/input-group/withdraw-section/asset-composition-table/asset-composition-table'

export const MultiTokenSelectItem = ({
  token,
  onSelect,
}: MultiTokenSelectItemProps) => {
  const { onClick } = useMultiTokenSelectItem({ token, onSelect })

  return (
    <div
      className="dtw-space-y-3 dtw-rounded-xl dtw-py-3 dtw-pl-4 dtw-pr-3"
      onClick={onClick}
    >
      <TokenBadge
        symbol={token.symbol}
        iconSymbols={[token.symbol]}
        size="xl"
        CustomIcon={
          <CircleStackIcon className="dtw-h-10 dtw-w-10 group-hover:dtw-opacity-100 dtw-opacity-100 sm:dtw-opacity-50" />
        }
        symbolClasses="dtw-text-sm dtw-font-medium group-hover:dtw-opacity-100 dtw-opacity-100 sm:dtw-opacity-80"
      />
      <AssetCompositionTable className="dtw-pt-2" showFraction={false} />
    </div>
  )
}
