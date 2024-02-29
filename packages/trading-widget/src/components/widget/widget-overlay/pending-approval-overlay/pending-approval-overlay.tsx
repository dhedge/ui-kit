import type { FC } from 'react'

import { PendingOverlay } from 'components/common'

import { useTranslationContext } from 'providers/translation-provider'

import { usePendingApprovalOverlay } from './pending-approval-overlay.hooks'

export const PendingApprovalOverlay: FC = () => {
  const t = useTranslationContext()
  const { text } = usePendingApprovalOverlay()

  return text ? <PendingOverlay title={t.approve} text={text} /> : null
}
