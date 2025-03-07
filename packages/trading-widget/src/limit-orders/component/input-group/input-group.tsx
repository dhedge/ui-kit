import type { FC } from 'react'

import { PriceInput } from 'limit-orders/component/common/price-input'
import { useInputGroup } from 'limit-orders/component/input-group/input-group.hooks'

export const InputGroup: FC = () => {
  const {
    takeProfitPrice,
    setTakeProfitPrice,
    setStopLossPrice,
    stopLossPrice,
    profitPricePlaceholder,
    lossPricePlaceholder,
    setTermsAccepted,
    termsAccepted,
  } = useInputGroup()

  return (
    <div className="dtw-flex dtw-flex-col dtw-gap-[var(--limit-order-gap)] dtw-px-[var(--limit-order-group-px)]">
      <PriceInput
        label="Take Profit"
        inputValue={takeProfitPrice}
        onInputChange={setTakeProfitPrice}
        placeholder={profitPricePlaceholder}
        autoFocus
      />
      <PriceInput
        label="Stop Loss"
        inputValue={stopLossPrice}
        onInputChange={setStopLossPrice}
        placeholder={lossPricePlaceholder}
      />
      <div className="dtw-mt-2 dtw-flex dtw-items-center dtw-space-x-2">
        <input
          type="checkbox"
          id="limitOrderCheckbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="dtw-h-4 dtw-w-4 dtw-rounded dtw-cursor-pointer"
        />
        <label
          htmlFor="limitOrderCheckbox"
          className="dtw-text-sm dtw-cursor-pointer"
        >
          I understand and accept limit orders are not guaranteed
        </label>
      </div>
    </div>
  )
}
