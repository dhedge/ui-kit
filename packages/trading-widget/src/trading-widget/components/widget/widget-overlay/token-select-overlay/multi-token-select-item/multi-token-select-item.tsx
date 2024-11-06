import { CircleStackIcon } from '@heroicons/react/20/solid'

import { TokenBadge } from 'trading-widget/components/common'

import { AllAssetsCompositionTable } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/all-assets-composition-table/all-assets-composition-table'

import type { MultiTokenSelectItemProps } from './multi-token-select-item.hooks'
import { useMultiTokenSelectItem } from './multi-token-select-item.hooks'

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
      <AllAssetsCompositionTable
        className="dtw-pt-2"
        showFraction={false}
        showAllAsset
      />
    </div>
  )
}
