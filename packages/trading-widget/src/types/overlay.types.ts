export const OVERLAY = {
  TERMS_OF_USE: 'TERMS_OF_USE',
} as const

export type OverlayType = (typeof OVERLAY)[keyof typeof OVERLAY]

export interface OverlayProps {
  type: OverlayType
}
