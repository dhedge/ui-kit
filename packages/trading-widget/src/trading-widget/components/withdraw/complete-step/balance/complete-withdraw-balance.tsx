import type { FC } from 'react'

import { ExternalLinkButton } from 'trading-widget/components/common'
import { AssetsCompositionTable } from 'trading-widget/components/common/balance/assets-composition-table'
import { useCompleteWithdrawBalance } from 'trading-widget/components/withdraw/complete-step/balance/complete-withdraw-balance.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const CompleteWithdrawBalance: FC = () => {
  const t = useTranslationContext()
  const { assets, usdAmount, withdrawalVaultLink } =
    useCompleteWithdrawBalance()

  return (
    <>
      <div className="dtw-text-sm dtw-flex dtw-items-center dtw-gap-1">
        <span className="dtw-text-[color:var(--panel-secondary-content-color)]">
          {t.total}
        </span>
        <ExternalLinkButton
          link={withdrawalVaultLink ?? ''}
          iconClassName="dtw-h-4 dtw-w-4 dtw-text-[color:var(--panel-content-color)]"
        >
          <span className="dtw-text-[color:var(--panel-content-color)]">
            {usdAmount}
          </span>
        </ExternalLinkButton>
      </div>
      <div className="dtw-flex dtw-flex-col dtw-gap-[var(--panel-input-group-gap,var(--panel-gap))] dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-border dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)] dtw-shadow-md dtw-border-[var(--panel-input-border-color)]">
        <AssetsCompositionTable assets={assets} />
      </div>
    </>
  )
}
