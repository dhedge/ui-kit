import type { FC } from 'react'

import type { useWithdrawAssetsInfo } from 'core-kit/hooks/trading/withdraw-v2/use-withdraw-assets-info'
import {
  formatNumberToLimitedDecimals,
  formatToUsd,
  formatUnits,
} from 'core-kit/utils'
import { TokenBadge } from 'trading-widget/components/common/index'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface AssetsCompositionTableProps {
  assets: ReturnType<typeof useWithdrawAssetsInfo>['data']
}

export const AssetsCompositionTable: FC<AssetsCompositionTableProps> = ({
  assets = [],
}) => {
  const { stablePrecision } = useConfigContextParams()

  return (
    <div className="dtw-text-sm dtw-font-light ">
      <table
        className="dtw-min-w-full dtw-border-separate"
        style={{ borderSpacing: '0px 0.25rem' }}
      >
        <tbody>
          {assets.map(
            ({ symbol, address, rawBalance, decimals, price, balance }) => {
              return (
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
            },
          )}
        </tbody>
      </table>
    </div>
  )
}
