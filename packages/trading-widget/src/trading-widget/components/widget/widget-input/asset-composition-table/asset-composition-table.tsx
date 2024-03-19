import classNames from 'classnames'

import { TokenBadge, Skeleton } from 'trading-widget/components/common'

import {
  useAssetCompositionTable,
  AssetCompositionTableProps,
} from './asset-composition-table.hooks'

export const AssetCompositionTable = ({
  className,
  showFraction = true,
  iconSize,
}: AssetCompositionTableProps) => {
  const { poolComposition } = useAssetCompositionTable()

  return (
    <div className={classNames('dtw-text-sm dtw-font-light', className)}>
      {poolComposition.length > 0 ? (
        <table
          className="dtw-min-w-full dtw-border-separate"
          style={{ borderSpacing: '0px 0.25rem' }}
        >
          <tbody>
            {poolComposition.map(
              ({ fraction, fractionUsd, tokenName, asset }) => (
                <tr key={tokenName}>
                  <td
                    style={{
                      width: 150,
                      maxWidth: 150,
                    }}
                  >
                    <TokenBadge
                      symbol={tokenName}
                      iconSymbols={asset.iconSymbols}
                      symbolClasses="dtw-text-xs dtw-font-bold"
                      size={iconSize}
                    />
                  </td>
                  {showFraction && (
                    <td
                      style={{
                        width: 150,
                        maxWidth: 150,
                      }}
                    >
                      <p className="dtw-truncate">{fraction}</p>
                      <p className="dtw-truncate dtw-text-xs dtw-text-themeGray-600">
                        {fractionUsd}
                      </p>
                    </td>
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      ) : (
        <Skeleton />
      )}
    </div>
  )
}
