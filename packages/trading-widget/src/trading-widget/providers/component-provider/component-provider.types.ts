import type { ComponentType, SVGProps } from 'react'

export interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  onError?: () => void
  className?: string
}

export interface ComponentProviderProps {
  config?: {
    GeoBlockAlert?: ComponentType
    DepositMetaInfo?: ComponentType
    WithdrawMetaInfo?: ComponentType
    ExtraActionButton?: ComponentType
    Image?: ComponentType<ImageProps>
    LogoSpinner?: ComponentType<SVGProps<SVGElement>>
    DepositTermsOfUse?: ComponentType
  }
}
