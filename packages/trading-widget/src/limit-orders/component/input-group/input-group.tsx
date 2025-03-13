import classNames from 'classnames'
import type { FC } from 'react'

import { PriceInput } from 'limit-orders/component/common/price-input'
import { useInputGroup } from 'limit-orders/component/input-group/input-group.hooks'

export const InputGroup: FC = () => {
  const {
    takeProfitPrice,
    setTakeProfitPrice,
    setStopLossPrice,
    stopLossPrice,
    setTermsAccepted,
    termsAccepted,
    pricingAssetPrice,
    takeProfitPriceDifference,
    stopLossPriceDifference,
    pricingAssetSymbol,
    isReversedOrder,
    takeProfitInputLabel,
    stopLossInputLabel,
  } = useInputGroup()

  return (
    <>
      <div
        className={classNames(
          'dtw-flex dtw-gap-[var(--limit-order-input-group-gap,var(--limit-order-gap))] dtw-px-[var(--limit-order-group-px)]',
          {
            'dtw-flex-col-reverse': isReversedOrder,
            'dtw-flex-col': !isReversedOrder,
          },
        )}
      >
        <PriceInput
          label={takeProfitInputLabel}
          price={pricingAssetPrice}
          inputValue={takeProfitPrice}
          onInputChange={setTakeProfitPrice}
          autoFocus
          percentage={takeProfitPriceDifference}
          symbol={pricingAssetSymbol}
        />
        <PriceInput
          label={stopLossInputLabel}
          inputValue={stopLossPrice}
          onInputChange={setStopLossPrice}
          price={pricingAssetPrice}
          percentage={stopLossPriceDifference}
          symbol={pricingAssetSymbol}
        />
      </div>
      <div className="dtw-mt-2 dtw-flex dtw-items-center dtw-gap-1.5 !dtw-text-[color:var(--limit-order-secondary-content-color)]">
        <input
          type="checkbox"
          id="limitOrderCheckbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="dtw-h-4 dtw-w-4 dtw-rounded dtw-cursor-pointer "
        />
        <label
          htmlFor="limitOrderCheckbox"
          className="dtw-text-sm dtw-cursor-pointer "
        >
          I understand and accept limit orders are not guaranteed
        </label>
      </div>
    </>
  )
}
