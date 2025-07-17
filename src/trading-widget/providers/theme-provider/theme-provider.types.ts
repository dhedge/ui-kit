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
      //success
      colorTextSuccess?: string
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
    notification?: {
      color?: {
        colorBg?: string
      }
    }
    popup?: {
      color?: {
        colorText?: string
        colorBg?: string
        colorBorder?: string
      }
      size?: {
        fontSize?: string
      }
      style?: object
    }
    popupList?: {
      color?: {
        itemBgEven?: string
        itemBgOdd?: string
        headerBg?: string
      }
      size?: object
      style?: object
    }
    tabGroup?: {
      color?: object
      size?: {
        px?: string
      }
    }
    tabList?: {
      color?: {
        colorBg?: string
      }
      style?: {
        radius?: string
      }
      size?: {
        px?: string
        py?: string
      }
    }
    tabContent?: {
      color?: object
      size?: {
        pt?: string
        px?: string
        pb?: string
        gap?: string
      }
      style?: object
    }
    tab?: {
      color?: {
        colorBg?: string
        colorText?: string
        selectColorText?: string
        colorTextHover?: string
      }
      size?: {
        px?: string
        py?: string
        fontSize?: string
      }
      style?: {
        fontWeight?: string
        lineHeight?: string
      }
    }
    balance?: {
      color?: {
        colorText?: string
        priceColorText?: string
      }
      size?: {
        px?: string
        gap?: string
        fontSize?: string
        lineHeight?: string
        priceFontSize?: string
        priceLineHeight?: string
      }
      style?: object
    }
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
    meta?: {
      color?: {
        linkTextColor?: string
        panelBgHover?: string
      }
      size?: {
        gap?: string
        px?: string
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
    divider?: {
      color?: {
        colorBg?: string
      }
    }
  }
}

export interface ThemeProviderProps {
  config?: ThemeProviderConfigProps
}
