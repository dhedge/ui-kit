import type { FC } from 'react'

import {
  formatNumberToLimitedDecimals,
  formatToUsd,
  formatUnits,
} from 'core-kit/utils'
import { Skeleton, TokenBadge } from 'trading-widget/components/common'
import { useBalance } from 'trading-widget/components/withdraw/swap-step/balance/balance.hooks'

export const Balance: FC = () => {
  const { assets } = useBalance()

  return (
    <div className="dtw-mt-1 dtw-flex dtw-flex-col dtw-gap-[var(--panel-input-group-gap,var(--panel-gap))] dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-border dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)] focus-within:dtw-border-[var(--panel-input-focus-border-color)] focus-within:dtw-bg-[var(--panel-input-focus-bg)] dtw-shadow-md dtw-border-[var(--panel-input-border-color)]">
      <div className="dtw-text-sm dtw-font-light">
        {assets.length > 0 ? (
          <>
            <table
              className="dtw-min-w-full dtw-border-separate"
              style={{ borderSpacing: '0px 0.25rem' }}
            >
              <tbody>
                {assets.map(({ symbol, address, balance, decimals }) => {
                  return (
                    <tr key={address}>
                      <td
                        style={{
                          width: 150,
                          maxWidth: 150,
                        }}
                      >
                        <TokenBadge
                          symbol={symbol}
                          iconSymbols={[symbol]}
                          symbolClasses="dtw-text-xs dtw-font-bold"
                          size="m"
                        />
                      </td>
                      <td
                        style={{
                          width: 150,
                          maxWidth: 150,
                        }}
                      >
                        <p className="dtw-truncate">
                          {formatNumberToLimitedDecimals(
                            formatUnits(balance, decimals),
                            2,
                          )}
                        </p>
                        <p className="dtw-truncate dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
                          {formatToUsd({ value: balance.toString() })}
                        </p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  )
}
