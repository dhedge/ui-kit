import type { FC } from 'react'

import { DEFAULT_VISIBLE_ASSETS_LIMIT } from 'core-kit/const'
import type { useWithdrawAssetsInfo } from 'core-kit/hooks/trading/withdraw-v2/use-withdraw-assets-info'
import {
  formatNumberToLimitedDecimals,
  formatToUsd,
  formatUnits,
} from 'core-kit/utils'
import { TokenBadge } from 'trading-widget/components/common/index'
import {
  AssetsCompositionDisclosure,
  AssetsCompositionTable,
} from 'trading-widget/components/common/meta/assets-composition-disclosure/assets-composition-disclosure'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface WithdrawAssetsCompositionTableProps {
  assets: ReturnType<typeof useWithdrawAssetsInfo>['data']
}

type AssetItem = NonNullable<
  ReturnType<typeof useWithdrawAssetsInfo>['data']
>[number]

export const WithdrawAssetsCompositionTable: FC<
  WithdrawAssetsCompositionTableProps
> = ({ assets = [] }) => {
  const { stablePrecision } = useConfigContextParams()

  const visibleAssets = assets.slice(0, DEFAULT_VISIBLE_ASSETS_LIMIT)
  const hiddenAssets = assets.slice(DEFAULT_VISIBLE_ASSETS_LIMIT)

  const renderRow = ({
    symbol,
    address,
    rawBalance,
    decimals,
    price,
    balance,
  }: AssetItem) => (
    <tr key={address}>
      <td>
        <TokenBadge
          symbol={symbol}
          iconSymbols={[symbol]}
          symbolClasses="dtw-text-xs dtw-font-bold"
          size="sm"
        />
        <p className="dtw-truncate dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
          {formatToUsd({
            value: balance * price,
          })}
        </p>
      </td>
      <td className="dtw-text-right">
        <p className="dtw-truncate">
          {formatNumberToLimitedDecimals(
            formatUnits(rawBalance, decimals),
            stablePrecision,
          )}
        </p>
      </td>
    </tr>
  )

  return (
    <div className="dtw-text-sm dtw-font-light ">
      <AssetsCompositionTable>
        {visibleAssets.map(renderRow)}
      </AssetsCompositionTable>
      {hiddenAssets.length > 0 && (
        <AssetsCompositionDisclosure>
          <AssetsCompositionTable>
            {hiddenAssets.map(renderRow)}
          </AssetsCompositionTable>
        </AssetsCompositionDisclosure>
      )}
    </div>
  )
}
