export const OVERLAY = {
  TERMS_OF_USE: 'TERMS_OF_USE',
  HIGH_SLIPPAGE: 'HIGH_SLIPPAGE',
  FMED_WITHDRAWAL: 'FMED_WITHDRAWAL',
  TOKEN_SELECT: 'TOKEN_SELECT',
  POOL_SELECT: 'POOL_SELECT',
} as const

export type OverlayType = (typeof OVERLAY)[keyof typeof OVERLAY]

export interface OverlayProps {
  type: OverlayType
}
