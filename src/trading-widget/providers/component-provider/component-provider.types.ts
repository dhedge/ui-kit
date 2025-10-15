import type { ComponentType, PropsWithChildren, SVGProps } from 'react'

export interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  onError?: () => void
  onLoad?: () => void
  className?: string
}

export interface ButtonProps {
  onClick?: () => void
  highlighted?: boolean
  disabled?: boolean
  className?: string
  type?: 'submit' | 'button'
  loading?: boolean
}

export interface AvailableLiquidityAlertProps {
  liquidityAmount: string
}

export interface MaxSupplyCapProps {
  supplyCapInUsd: string
}

export interface ComponentProviderProps {
  config?: {
    GeoBlockAlert?: ComponentType
    SanctionedAlert?: ComponentType
    DepositMetaInfo?: ComponentType
    WithdrawMetaInfo?: ComponentType
    CustomDepositMeta?: ComponentType
    Image?: ComponentType<ImageProps>
    LogoSpinner?: ComponentType<SVGProps<SVGElement>>
    DepositTermsOfUse?: ComponentType
    ActionButton?: ComponentType<PropsWithChildren<ButtonProps>>
    AvailableLiquidityAlert?: ComponentType<AvailableLiquidityAlertProps>
    MaxSupplyReachedAlert?: ComponentType<MaxSupplyCapProps>
    OnDemandWithdrawAlert?: ComponentType
  }
}
