export interface ThemeProviderConfigProps {
  global?: {
    color?: {
      //primary
      colorTextPrimary?: string
      colorTextPrimaryHover?: string
      colorBorderPrimary?: string
      colorBgPrimary?: string
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
      colorIcon?: string
      //scrollbar
      colorScrollbar?: string
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
      iconSize?: string
      iconSizeSm?: string
      iconSecondarySize?: string
      iconSecondarySizeSm?: string
      labelFontSize?: string
      labelLineHeight?: string
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
    inputGroup?: {
      color?: object
      size?: {
        px?: string
        gap?: string
      }
      style?: object
    }
    input?: {
      color?: {
        textColor?: string
        loadingTextColor?: string
        bgColor?: string
        bgColorFocus?: string
        borderColor?: string
        borderColorFocus?: string
        placeholderColor?: string
        buttonBgColor?: string
        buttonBorderColor?: string
        buttonTextColor?: string
      }
      size?: {
        px?: string
        py?: string
        gap?: string
        priceGap?: string
        iconSize?: string
        iconSizeSm?: string
        labelFontSize?: string
        labelLineHeight?: string
        fontSize?: string
        lineHeight?: string
        fontSizeLg?: string
        lineHeightLg?: string
        tokenFontSize?: string
        tokenLineHeight?: string
        tokenFontSizeSm?: string
        tokenLineHeightSm?: string
        buttonPx?: string
        buttonPy?: string
        buttonFontSize?: string
        buttonLineHeight?: string
      }
      style?: {
        radius?: string
        labelFontWeight?: string
        fontWeight?: string
        tokenFontWeight?: string
        buttonRadius?: string
      }
    }
    actionButton?: {
      color?: {
        colorBgFrom?: string
        colorBgTo?: string
        colorBgFromHover?: string
        colorBgToHover?: string
        colorBorder?: string
        colorText?: string
        outlineColorBorder?: string
        outlineColorBorderHover?: string
        outlineColorText?: string
      }
      size?: {
        borderWidth?: string
      }
      style?: object
    }
    tooltip?: {
      color?: {
        colorBg?: string
        colorText?: string
      }
      size?: object
      style?: object
    }
    switchPanel?: {
      color?: {
        colorBorder?: string
      }
      size?: object
      style?: {
        radius?: string
      }
    }
    switch?: {
      color?: {
        colorBgChecked?: string
        colorBg?: string
        colorThumbBgChecked?: string
        colorThumbBg?: string
        color?: string
        colorChecked?: string
      }
      size?: object
      style?: object
    }
    checkbox?: {
      color?: {
        colorBgChecked?: string
        colorBg?: string
        color?: string
        colorBorder?: string
        colorBorderChecked?: string
      }
      size?: {
        size?: string
        iconSize?: string
      }
      style?: {
        radius?: string
      }
    }
  }
}

export interface ThemeProviderProps {
  config?: ThemeProviderConfigProps
}
