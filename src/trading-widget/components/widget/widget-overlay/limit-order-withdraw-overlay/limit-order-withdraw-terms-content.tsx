import classNames from 'classnames'
import type { FC } from 'react'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface WithdrawTermsContentProps {
  className?: string
}

const TERMS_KEYS = [
  'termOfUseWithdrawPoint1',
  'termOfUseWithdrawPoint2',
] as const

export const LimitOrderWithdrawTermsContent: FC<WithdrawTermsContentProps> = ({
  className,
}) => {
  const t = useTranslationContext()

  return (
    <>
      <p>{t.limitOrderWithdrawDescription}</p>
      <div
        className={classNames(
          'dtw-w-full dtw-text-sm dtw-overflow-y-auto theme-scrollbar dtw-text-[color:var(--panel-secondary-content-color)]',
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
    </>
  )
}
