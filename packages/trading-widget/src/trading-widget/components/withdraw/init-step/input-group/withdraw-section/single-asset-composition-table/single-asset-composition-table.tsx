import { Spinner } from 'trading-widget/components/common'
import { AssetsCompositionTable } from 'trading-widget/components/common/balance/assets-composition-table'
import { useSingleAssetCompositionTable } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/single-asset-composition-table/single-asset-composition-table.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const SingleAssetCompositionTable = () => {
  const t = useTranslationContext()
  const { usdAmount, isLoading, assets } = useSingleAssetCompositionTable()

  return isLoading ? (
    <div className="dtw-ml-auto dtw-h-[22px]">
      <Spinner className="dtw-stroke-[color:var(--panel-accent-from-color)] dtw-h-[var(--panel-icon-secondary-size)] sm:dtw-h-[var(--panel-icon-secondary-size-sm)] dtw-w-[var(--panel-icon-secondary-size)] sm:dtw-w-[var(--panel-icon-secondary-size-sm)]" />
    </div>
  ) : (
    <>
      <AssetsCompositionTable assets={assets} />
      {!!assets.length && (
        <div className="dtw-mt-1 dtw-text-sm">
          <span className="dtw-text-[color:var(--panel-secondary-content-color)]">
            {t.total}{' '}
          </span>
          <span className="dtw-text-[color:var(--panel-content-color)]">
            {usdAmount}
          </span>
        </div>
      )}
    </>
  )
}
