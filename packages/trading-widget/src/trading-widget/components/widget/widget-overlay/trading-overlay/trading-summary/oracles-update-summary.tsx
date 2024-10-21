import type { FC } from 'react'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const OraclesUpdateSummary: FC = () => {
  const t = useTranslationContext()

  return (
    <div className="dtw-flex dtw-items-center dtw-justify-center dtw-gap-1 dtw-flex-wrap dtw-overflow-hidden">
      {t.updateSynthetixOracles}
    </div>
  )
}
