import type { FC } from 'react'

import type { TermsKey } from 'limit-orders/providers/translation-provider'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'

const TERMS_KEYS: TermsKey[] = [
  'termsPoint1',
  'termsPoint2',
  'termsPoint3',
  'termsPoint4',
  'termsPoint5',
]

export const TermsContent: FC = () => {
  const t = useTranslationContext()

  return (
    <div className="dtw-w-full dtw-text-sm dtw-mt-2 dtw-max-h-[120px] dtw-overflow-y-auto theme-scrollbar dtw-text-[color:var(--limit-order-secondary-content-color)]">
      <ol className="dtw-list-decimal dtw-list-inside dtw-space-y-2">
        {TERMS_KEYS.map((key, index) => (
          <li key={key}>
            {index + 1}. {t[key]}
          </li>
        ))}
      </ol>
    </div>
  )
}
