import type { FC } from 'react'

import {
  formatNumberToLimitedDecimals,
  formatToUsd,
  formatUnits,
} from 'core-kit/utils'
import { TokenBadge } from 'trading-widget/components/common'
import { useCompleteWithdrawBalance } from 'trading-widget/components/withdraw/complete-step/balance/complete-withdraw-balance.hooks'
import { ClaimButton } from 'trading-widget/components/withdraw/complete-step/button/claim-button/claim-button'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const CompleteWithdrawBalance: FC = () => {
  const { stablePrecision } = useConfigContextParams()
  const { assets, usdAmount, showClaimButton } = useCompleteWithdrawBalance()

  return (
    <>
      <span className=" dtw-text-[length:var(--panel-balance-price-font-size,var(--panel-font-size))] dtw-leading-[var(--panel-balance-line-height,var(--panel-line-height-lg))] dtw-text-[color:var(--panel-balance-content-color,var(--panel-content-color))]">
        {usdAmount}
      </span>
      <div className="dtw-mt-2 dtw-flex dtw-flex-col dtw-gap-[var(--panel-input-group-gap,var(--panel-gap))] dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-border dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)] dtw-shadow-md dtw-border-[var(--panel-input-border-color)]">
        <div className="dtw-text-sm dtw-font-light">
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
                          size="m"
                        />
                      </td>
                      <td className="dtw-text-right">
                        <p className="dtw-truncate">
                          {formatNumberToLimitedDecimals(
                            formatUnits(rawBalance, decimals),
                            stablePrecision,
                          )}
                        </p>
                        <p className="dtw-truncate dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
                          {formatToUsd({
                            value: balance * price,
                          })}
                        </p>
                      </td>
                    </tr>
                  )
                },
              )}
            </tbody>
          </table>
        </div>
        {showClaimButton && (
          <div className="dtw-self-start">
            <ClaimButton
              highlighted={false}
              className="!dtw-py-0.5 dtw-text-[length:var(--panel-input-button-font-size,var(--panel-font-size-xs))]"
            />
          </div>
        )}
      </div>
    </>
  )
}
