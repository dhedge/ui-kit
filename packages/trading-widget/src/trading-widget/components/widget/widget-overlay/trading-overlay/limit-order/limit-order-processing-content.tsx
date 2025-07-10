import { useTradingPanelModal } from 'core-kit/hooks/state'
import { ExternalLinkButton, Spinner } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const LimitOrderProcessingContent = () => {
  const t = useTranslationContext()
  const { LogoSpinner = Spinner } = useComponentContext()
  const [{ link }] = useTradingPanelModal()

  return (
    <div className="dtw-flex dtw-flex-col dtw-items-center dtw-justify-center dtw-gap-2 dtw-pt-1 dtw-px-4 dtw-w-full dtw-h-full md:dtw-w-1/2 md:dtw-h-1/2">
      <LogoSpinner className="dtw-h-16 dtw-w-16 lg:dtw-h-24 lg:dtw-w-24 dtw-shrink-0" />
      {t.miningTx}
      {link && (
        <ExternalLinkButton
          link={link}
          className="dtw-text-sm"
          iconClassName="dtw-w-4 dtw-h-4"
        >
          {t.explorer}
        </ExternalLinkButton>
      )}
    </div>
  )
}
