import type { FC } from 'react'

import { TokenIcon, TooltipIcon } from 'trading-widget/components/common'
import { TokenSelector } from 'trading-widget/components/widget/widget-input/token-selector/token-selector'
import { AssetCompositionTable } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/asset-composition-table/asset-composition-table'
import type { WithdrawSectionProps } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/withdraw-section.hooks'
import { useWithdrawSection } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/withdraw-section.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const WithdrawSection: FC<WithdrawSectionProps> = (props) => {
  const t = useTranslationContext()
  const { isMultiAssetWithdraw, label, assetSymbol, vaultSymbol } =
    useWithdrawSection(props)

  return (
    <div className="dtw-flex dtw-flex-col dtw-gap-[var(--panel-input-group-gap,var(--panel-gap))] dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-border dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)] focus-within:dtw-border-[var(--panel-input-focus-border-color)] focus-within:dtw-bg-[var(--panel-input-focus-bg)] dtw-shadow-md dtw-border-[var(--panel-input-border-color)]">
      <div className="dtw-flex dtw-justify-between dtw-text-[length:var(--panel-input-label-font-size,var(--panel-font-size-sm))] dtw-leading-[var(--panel-input-label-line-height,var(--panel-line-height-sm))] dtw-font-[var(--panel-input-label-font-weight,var(--panel-font-weight-light))] dtw-gap-x-2">
        <span>{label}</span>
      </div>
      <div className="dtw-flex dtw-items-center dtw-gap-x-2">
        <div className="transparent-scrollbar dtw-flex-1 dtw-overflow-x-auto">
          {isMultiAssetWithdraw ? (
            <AssetCompositionTable iconSize="sm" />
          ) : (
            <div className="dtw-text-[length:var(--panel-label-font-size,var(--panel-font-size-xs))]">
              <TokenIcon
                symbols={[assetSymbol]}
                size="sm"
                className="!dtw-inline-block dtw-mb-0.5"
              />{' '}
              Withdrawing into {assetSymbol} includes 2 transactions
              <ul>
                <li className="dtw-mt-1">
                  1.{' '}
                  {t.initWithdrawDescription.replace(
                    '{vaultSymbol}',
                    vaultSymbol,
                  )}{' '}
                  <TooltipIcon
                    text={t.initWithdrawTooltip}
                    iconClassName="!dtw-inline"
                  />
                </li>
                <li className="dtw-mt-1">
                  2.{' '}
                  {t.completeWithdrawDescription.replace(
                    '{assetSymbol}',
                    assetSymbol,
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
        <TokenSelector symbol={assetSymbol} />
      </div>
    </div>
  )
}
