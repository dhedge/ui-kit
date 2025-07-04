import { CheckIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import type { FC } from 'react'

import type { Balance, TradingToken } from 'core-kit/types'
import { Spinner, TokenBadge } from 'trading-widget/components/common'

type PoolListItem = Pick<TradingToken, 'symbol'> &
  Pick<Balance, 'balanceInUsd' | 'balanceInUsdNumber'> & { isActive: boolean }

interface NetworkTableProps {
  data: PoolListItem[]
}

export const NetworkTable: FC<NetworkTableProps> = ({ data }) => {
  return (
    <table
      className="dtw-min-w-full dtw-border-separate"
      style={{ borderSpacing: '0px 0.25rem' }}
    >
      <tbody>
        {data.map(({ symbol, balanceInUsd, balanceInUsdNumber, isActive }) => (
          <tr key={symbol}>
            <td
              style={{
                width: 50,
                maxWidth: 50,
              }}
            >
              <TokenBadge
                symbol={symbol}
                iconSymbols={[symbol]}
                className={classNames('group-hover:dtw-opacity-100', {
                  'dtw-opacity-100': isActive,
                  'dtw-opacity-100 sm:dtw-opacity-50': !isActive,
                })}
              />
            </td>
            <td>
              {balanceInUsdNumber ? (
                balanceInUsd
              ) : (
                <Spinner className="dtw-h-4 dtw-w-4" />
              )}
            </td>
            <td
              style={{
                width: 30,
                maxWidth: 30,
              }}
            >
              {isActive && (
                <CheckIcon className="dtw-h-4 dtw-w-4 dtw-text-themeGreen" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
