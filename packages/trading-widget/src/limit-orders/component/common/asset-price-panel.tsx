import type { FC } from 'react'

import { useTranslationContext } from 'limit-orders/providers/translation-provider'

interface AssetPricePanelProps {
  symbol: string
  price: string | null
}

export const AssetPricePanel: FC<AssetPricePanelProps> = ({
  symbol,
  price,
}) => {
  const t = useTranslationContext()
  return (
    <div className="dtw-px-3 dtw-py-2.5 dtw-flex dtw-justify-between dtw-bg-[color:var(--limit-order-secondary-color)] dtw-text-[length:var(--limit-order-font-size-xs)] dtw-rounded-[var(--limit-order-radius)]">
      <span className="dtw-text-xs">
        {t.currentPrice.replace('{symbol}', symbol)}
      </span>
      <span className="dtw-font-[var(--limit-order-font-weight-bold)]">
        {price}
      </span>
    </div>
  )
}
