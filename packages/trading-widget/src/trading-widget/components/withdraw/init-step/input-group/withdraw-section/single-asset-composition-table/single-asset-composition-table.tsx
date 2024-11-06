import type { FC } from 'react'

import { Spinner } from 'trading-widget/components/common'
import { WithdrawAssetsCompositionTable } from 'trading-widget/components/common/balance/withdraw-assets-composition-table'
import type { SingleAssetCompositionTableProps } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/single-asset-composition-table/single-asset-composition-table.hooks'
import { useSingleAssetCompositionTable } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/single-asset-composition-table/single-asset-composition-table.hooks'

export const SingleAssetCompositionTable: FC<
  SingleAssetCompositionTableProps
> = ({ assets, isLoading }) => {
  const { showSingleTokenAmount, singleTokenBalance, showReceivedResults } =
    useSingleAssetCompositionTable({ assets })

  if (!showReceivedResults) {
    return null
  }

  return isLoading ? (
    <div className="dtw-ml-auto dtw-h-[22px]">
      <Spinner className="dtw-stroke-[color:var(--panel-accent-from-color)] dtw-h-[var(--panel-icon-secondary-size)] sm:dtw-h-[var(--panel-icon-secondary-size-sm)] dtw-w-[var(--panel-icon-secondary-size)] sm:dtw-w-[var(--panel-icon-secondary-size-sm)]" />
    </div>
  ) : (
    <div>
      {showSingleTokenAmount ? (
        <div>{singleTokenBalance}</div>
      ) : (
        <WithdrawAssetsCompositionTable assets={assets} />
      )}
    </div>
  )
}
