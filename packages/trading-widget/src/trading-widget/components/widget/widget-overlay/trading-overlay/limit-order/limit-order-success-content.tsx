import { CheckIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import {
  ActionButton,
  ExternalLinkButton,
} from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface LimitOrderSuccessContentProps {
  onClose: () => void
}

export const LimitOrderSuccessContent: FC<LimitOrderSuccessContentProps> = ({
  onClose,
}) => {
  const t = useTranslationContext()
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const [{ link }] = useTradingPanelModal()

  return (
    <>
      <div className="dtw-flex dtw-flex-col dtw-items-center dtw-justify-center dtw-gap-2 dtw-pt-1 dtw-px-4 dtw-w-full dtw-h-full md:dtw-w-1/2 md:dtw-h-1/2">
        <div className="dtw-flex dtw-flex-col dtw-items-center dtw-gap-2 dtw-text-[color:var(--panel-success-content-color)]">
          <CheckIcon className="dtw-h-16 dtw-w-16 lg:dtw-h-24 lg:dtw-w-24 dtw-shrink-0" />
          {t.createLimitSellOrder}
        </div>
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
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <Button highlighted={false} onClick={onClose}>
          {t.done}
        </Button>
      </div>
    </>
  )
}
