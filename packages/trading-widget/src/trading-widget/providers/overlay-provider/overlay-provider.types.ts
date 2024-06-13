import type { OverlayType } from 'trading-widget/types'

export type OverlayProviderState = Record<
  OverlayType,
  Pick<MergeOverlayActionPayload, 'isOpen' | 'onConfirm' | 'isPending'>
>

type MergeOverlayActionPayload = {
  isOpen: boolean
  type: OverlayType
  isPending?: boolean
  onConfirm?: (setPendingState: (pending: boolean) => void) => Promise<void>
}

export type OverlayProviderAction = {
  type: 'MERGE_OVERLAY'
  payload: MergeOverlayActionPayload
}
