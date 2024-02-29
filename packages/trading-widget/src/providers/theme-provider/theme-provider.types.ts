export interface ThemeProviderConfigProps {
  global?: {
    color?: {
      //primary
      colorTextPrimary?: string
      colorTextPrimaryHover?: string
      colorBorderPrimary?: string
      //secondary
      colorTextSecondary?: string
      colorBgSecondary?: string
      //accent
      colorTextAccent?: string
      colorTextAccentHover?: string
      colorBgAccentFrom?: string
      colorBgAccentTo?: string
      colorBgAccentFromHover?: string
      colorBgAccentToHover?: string
      //neutral
      colorTextNeutral?: string
      colorBgNeutral?: string
      //loading
      colorTextLoading?: string
      //error
      colorTextError?: string
      //warning
      colorTextWarning?: string
    }
    size?: {
      gap?: string
      spacer?: string
      fontSizeBase?: string
      lineHeightBase?: string
      fontSizeXs?: string
      lineHeightXs?: string
      fontSizeSm?: string
      lineHeightSm?: string
      fontSizeLg?: string
      lineHeightLg?: string
    }
    style?: {
      radiusPrimary?: string
      radiusSecondary?: string
      fontWeightLight?: string
      fontWeightMedium?: string
      fontWeightBold?: string
      actionOpacity?: string
      actionOpacityHover?: string
    }
  }
  component?: {
    color?: {}
    size?: {}
    style?: {}
  }
}

export interface ThemeProviderProps {
  config?: ThemeProviderConfigProps
}
