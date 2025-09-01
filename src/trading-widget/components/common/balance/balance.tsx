import type { FC } from 'react'

interface BalanceProps {
  balance: string
  symbol: string
}

export const Balance: FC<BalanceProps> = ({ balance, symbol }) => (
  <span
    title={symbol}
    className="dtw-text-[length:var(--panel-balance-font-size)] dtw-leading-[var(--panel-balance-line-height)] dtw-text-[color:var(--panel-balance-content-color)] dtw-whitespace-nowrap"
  >
    {balance}
  </span>
)
