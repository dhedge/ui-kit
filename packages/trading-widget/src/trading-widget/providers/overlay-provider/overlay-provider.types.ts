import type { OverlayType } from 'trading-widget/types'

export type OverlayProviderState = Record<
  OverlayType,
  Pick<MergeOverlayActionPayload, 'isOpen' | 'onConfirm' | 'isPending' | 'meta'>
>

type MergeOverlayActionPayload = {
  isOpen: boolean
  type: OverlayType
  isPending?: boolean
  onConfirm?: (setPendingState: (pending: boolean) => void) => Promise<void>
  meta?: {
    error?: string
  }
}

export type OverlayProviderAction = {
  type: 'MERGE_OVERLAY'
  payload: MergeOverlayActionPayload
}
