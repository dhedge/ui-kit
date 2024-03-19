import type { FC } from 'react'

interface BalanceProps {
  balance: string
  price: string | null
}

export const Balance: FC<BalanceProps> = ({ balance, price }) => (
  <div className="dtw-flex dtw-items-center dtw-justify-between">
    <span className="dtw-text-[length:var(--panel-balance-font-size,var(--panel-font-size-lg))] dtw-leading-[var(--panel-balance-line-height,var(--panel-line-height-lg))] dtw-text-[color:var(--panel-balance-content-color,var(--panel-content-color))]">
      {balance}
    </span>
    {price && (
      <span className="dtw-text-[color:var(--panel-balance-price-content-color,var(--panel-secondary-content-color))] dtw-text-[length:var(--panel-balance-price-font-size,var(--panel-font-size))] dtw-leading-[var(--panel-balance-price-line-height,var(--panel-line-height))]">
        {price}
      </span>
    )}
  </div>
)
