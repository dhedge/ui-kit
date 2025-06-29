import classNames from 'classnames'
import type { FC } from 'react'

import type { TermsKey } from 'limit-orders/providers/translation-provider'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'

interface TermsContentProps {
  className?: string
}

const TERMS_KEYS: TermsKey[] = [
  'termsPoint1',
  'termsPoint2',
  'termsPoint3',
  'termsPoint4',
  'termsPoint5',
]

export const TermsContent: FC<TermsContentProps> = ({ className }) => {
  const t = useTranslationContext()

  return (
    <div
      className={classNames(
        'dtw-w-full dtw-text-[length:var(--limit-order-font-size-xs)] dtw-max-h-[120px] dtw-overflow-y-auto theme-scrollbar dtw-text-[color:var(--limit-order-secondary-content-color)]',
        className,
      )}
    >
      <ol className="dtw-list-decimal dtw-list-inside dtw-space-y-2">
        {TERMS_KEYS.map((key, index) => (
          <li key={key} className="dtw-text-pretty">
            {index + 1}. {t[key]}
          </li>
        ))}
      </ol>
    </div>
  )
}
