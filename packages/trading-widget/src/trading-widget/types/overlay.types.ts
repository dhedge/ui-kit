export const OVERLAY = {
  TERMS_OF_USE: 'TERMS_OF_USE',
  HIGH_SLIPPAGE: 'HIGH_SLIPPAGE',
  FMP_WITHDRAWAL: 'FMP_WITHDRAWAL',
  TOKEN_SELECT: 'TOKEN_SELECT',
  POOL_SELECT: 'POOL_SELECT',
  TRADING: 'TRADING',
  ERROR_NOTIFICATION: 'ERROR_NOTIFICATION',
  LIMIT_SELLS: 'LIMIT_SELLS',
} as const

export type OverlayType = (typeof OVERLAY)[keyof typeof OVERLAY]

export interface OverlayProps {
  type: OverlayType
}
