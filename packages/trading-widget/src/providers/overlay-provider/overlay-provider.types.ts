import type { OverlayType } from 'types'

export type OverlayProviderState = Record<
  OverlayType,
  Pick<MergeOverlayActionPayload, 'isOpen' | 'onConfirm'>
>

type MergeOverlayActionPayload = {
  isOpen: boolean
  type: OverlayType
  onConfirm?: () => void
}

export type OverlayProviderAction = {
  type: 'MERGE_OVERLAY'
  payload: MergeOverlayActionPayload
}
