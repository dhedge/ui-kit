import type { FC } from 'react'

import { TokenSelector } from 'trading-widget/components/widget/widget-input/token-selector/token-selector'
import { AllAssetsCompositionTable } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/all-assets-composition-table/all-assets-composition-table'
import { SingleAssetCompositionTable } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/single-asset-composition-table/single-asset-composition-table'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface WithdrawSectionProps {
  isMultiAssetWithdraw: boolean
  assetSymbol: string
}

export const WithdrawSection: FC<WithdrawSectionProps> = ({
  isMultiAssetWithdraw,
  assetSymbol,
}) => {
  const t = useTranslationContext()

  return (
    <div className="dtw-flex dtw-flex-col dtw-gap-[var(--panel-input-group-gap,var(--panel-gap))] dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-border dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)] focus-within:dtw-border-[var(--panel-input-focus-border-color)] focus-within:dtw-bg-[var(--panel-input-focus-bg)] dtw-shadow-md dtw-border-[var(--panel-input-border-color)]">
      <div className="dtw-flex dtw-justify-between dtw-text-[length:var(--panel-input-label-font-size,var(--panel-font-size-sm))] dtw-leading-[var(--panel-input-label-line-height,var(--panel-line-height-sm))] dtw-font-[var(--panel-input-label-font-weight,var(--panel-font-weight-light))] dtw-gap-x-2">
        <span>
          {isMultiAssetWithdraw
            ? t.receiveEstimated
            : t.receiveSwappableAssetsEstimated}
        </span>
      </div>
      <div className="dtw-flex dtw-items-center dtw-gap-x-2">
        <div className="transparent-scrollbar dtw-flex-1 dtw-overflow-x-auto">
          {isMultiAssetWithdraw ? (
            <AllAssetsCompositionTable iconSize="sm" />
          ) : (
            <SingleAssetCompositionTable />
          )}
        </div>
        <TokenSelector symbol={assetSymbol} />
      </div>
    </div>
  )
}
