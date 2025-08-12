import type { FC } from 'react'

interface BalanceProps {
  balance: string
}

export const Balance: FC<BalanceProps> = ({ balance }) => (
  <span className="dtw-text-[length:var(--panel-balance-font-size)] dtw-leading-[var(--panel-balance-line-height)] dtw-text-[color:var(--panel-balance-content-color)]">
    {balance}
  </span>
)
