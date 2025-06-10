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

export interface CheckboxProps {
  checked: boolean
  onChange: () => void
  className?: string
}

export interface ComponentProviderProps {
  config?: {
    GeoBlockAlert?: ComponentType
    SanctionedAlert?: ComponentType
    DepositMetaInfo?: ComponentType
    WithdrawMetaInfo?: ComponentType
    ExtraActionButton?: ComponentType
    Image?: ComponentType<ImageProps>
    LogoSpinner?: ComponentType<SVGProps<SVGElement>>
    DepositTermsOfUse?: ComponentType
    ActionButton?: ComponentType<PropsWithChildren<ButtonProps>>
    Checkbox?: ComponentType<CheckboxProps>
  }
}
