import classNames from 'classnames'

import { FLATMONEY_COLLATERAL_SYMBOL_MAP } from 'core-kit/const'
import { isFlatMoneyLeveragedRethAsset } from 'core-kit/utils'
import {
  Skeleton,
  TokenBadge,
  TokenIcon,
} from 'trading-widget/components/common'

import type { AssetCompositionTableProps } from './asset-composition-table.hooks'
import { useAssetCompositionTable } from './asset-composition-table.hooks'
import { useTranslationContext } from '../../../../providers/translation-provider'

export const AssetCompositionTable = ({
  className,
  showFraction = true,
  iconSize,
}: AssetCompositionTableProps) => {
  const t = useTranslationContext()
  const { poolComposition, chainId } = useAssetCompositionTable()

  return (
    <div className={classNames('dtw-text-sm dtw-font-light', className)}>
      {poolComposition.length > 0 ? (
        <table
          className="dtw-min-w-full dtw-border-separate"
          style={{ borderSpacing: '0px 0.25rem' }}
        >
          <tbody>
            {poolComposition.map(
              ({ fraction, fractionUsd, tokenName, asset, tokenAddress }) => {
                const isLeveragedRethAsset =
                  isFlatMoneyLeveragedRethAsset(tokenAddress)
                return (
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
                      {isLeveragedRethAsset && (
                        <div className="dtw-flex dtw-gap-1 dtw-items-center dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
                          {t.as}{' '}
                          <TokenIcon
                            symbols={[
                              FLATMONEY_COLLATERAL_SYMBOL_MAP[chainId] ??
                                'reth',
                            ]}
                            size="xs"
                          />{' '}
                          {FLATMONEY_COLLATERAL_SYMBOL_MAP[chainId] ?? 'rETH'}
                        </div>
                      )}
                    </td>
                    {showFraction && (
                      <td
                        style={{
                          width: 150,
                          maxWidth: 150,
                        }}
                      >
                        <p className="dtw-truncate">{fraction}</p>
                        <p className="dtw-truncate dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
                          {fractionUsd}
                        </p>
                      </td>
                    )}
                  </tr>
                )
              },
            )}
          </tbody>
        </table>
      ) : (
        <Skeleton />
      )}
    </div>
  )
}
