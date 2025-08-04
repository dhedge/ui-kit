import type { FC, PropsWithChildren } from 'react'

import { COLORS } from 'theme/colors'

import type { ThemeProviderProps } from 'trading-widget/providers/theme-provider/theme-provider.types'

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  config,
}) => {
  return (
    <div
      style={{
        //global-style
        // add custom CSS variables to d.ts
        // @typescript-eslint/ban-ts-comment
        // @ts-expect-error TODO add typings
        '--panel-radius': `${config?.global?.style?.radiusPrimary ?? `1rem`}`,
        '--panel-radius-secondary': `${
          config?.global?.style?.radiusSecondary ?? `1rem`
        }`,

        //widget background
        '--panel-background-color': `${
          config?.global?.color?.colorBgPrimary ?? COLORS.DARK['800']
        }`,

        //global-size
        '--panel-gap': `${config?.global?.size?.gap ?? `0.25rem`}`,
        '--panel-spacer': `${config?.global?.size?.spacer ?? `4px`}`,

        //global-color
        '--panel-content-color': `${
          config?.global?.color?.colorTextPrimary ?? COLORS.WHITE.DEFAULT
        }`,
        '--panel-content-hover-color': `${
          config?.global?.color?.colorTextPrimaryHover ??
          `${COLORS.WHITE.DEFAULT}CC`
        }`,

        '--panel-secondary-color': `${
          config?.global?.color?.colorBgSecondary ?? COLORS.GRAY['800']
        }`,
        '--panel-secondary-content-color': `${
          config?.global?.color?.colorTextSecondary ?? COLORS.GRAY['600']
        }`,

        '--panel-accent-from-color': `${
          config?.global?.color?.colorBgAccentFrom ?? COLORS.GREEN.DEFAULT
        }`,
        '--panel-accent-to-color': `${
          config?.global?.color?.colorBgAccentTo ?? COLORS.GREEN['700']
        }`,
        '--panel-accent-hover-from-color': `${
          config?.global?.color?.colorBgAccentFromHover ??
          `${COLORS.GREEN.DEFAULT}CC`
        }`,
        '--panel-accent-hover-to-color': `${
          config?.global?.color?.colorBgAccentToHover ?? COLORS.BLUE.dark
        }`,
        '--panel-accent-content-color': `${
          config?.global?.color?.colorTextAccent ?? COLORS.WHITE.DEFAULT
        }`,
        '--panel-accent-content-hover-color': `${
          config?.global?.color?.colorTextAccentHover ??
          `${COLORS.WHITE.DEFAULT}CC`
        }`,

        '--panel-neutral-color': `${
          config?.global?.color?.colorBgNeutral ?? `${COLORS.GRAY['600']}33`
        }`,
        '--panel-neutral-content-color': `${
          config?.global?.color?.colorTextNeutral ?? `${COLORS.GRAY['600']}80`
        }`,

        '--panel-loading-content-color': `${
          config?.global?.color?.colorTextLoading ?? `${COLORS.WHITE.DEFAULT}99`
        }`,

        '--panel-error-content-color': `${
          config?.global?.color?.colorTextError ?? COLORS.RED['500']
        }`,

        '--panel-warning-content-color': `${
          config?.global?.color?.colorTextWarning ?? COLORS.AMBER['400']
        }`,

        '--panel-success-content-color': `${
          config?.global?.color?.colorTextSuccess ?? COLORS.GREEN.DEFAULT
        }`,

        '--panel-border-color': `${
          config?.global?.color?.colorBorderPrimary ??
          `var(--panel-content-color)`
        }`,

        //divider
        '--panel-divider-color': `${
          config?.component?.divider?.color?.colorBg ??
          'var(--panel-secondary-content-color)'
        }`,

        //scrollbar
        '--panel-scrollbar-color': `${
          config?.global?.color?.colorScrollbar ?? `${COLORS.GREEN.DEFAULT}80`
        }`,

        //global-size
        '--panel-font-size': `${config?.global?.size?.fontSizeBase ?? '16px'}`,
        '--panel-line-height': `${
          config?.global?.size?.lineHeightBase ?? '24px'
        }`,

        '--panel-font-size-lg': `${config?.global?.size?.fontSizeLg ?? '18px'}`,
        '--panel-line-height-lg': `${
          config?.global?.size?.lineHeightLg ?? '28px'
        }`,

        '--panel-font-size-sm': `${config?.global?.size?.fontSizeSm ?? '14px'}`,
        '--panel-line-height-sm': `${
          config?.global?.size?.lineHeightSm ?? '20px'
        }`,

        '--panel-font-size-xs': `${config?.global?.size?.fontSizeXs ?? '12px'}`,
        '--panel-line-height-xs': `${
          config?.global?.size?.lineHeightXs ?? '16px'
        }`,

        //global-style
        '--panel-font-weight-light': `${
          config?.global?.style?.fontWeightLight ?? 300
        }`,
        '--panel-font-weight-medium': `${
          config?.global?.style?.fontWeightMedium ?? 500
        }`,
        '--panel-font-weight-bold': `${
          config?.global?.style?.fontWeightBold ?? 700
        }`,

        '--panel-action-opacity': `${
          config?.global?.style?.actionOpacity ?? 1
        }`,
        '--panel-action-hover-opacity': `${
          config?.global?.style?.actionOpacityHover ?? 0.8
        }`,

        //label
        //label-typography
        '--panel-label-font-size': `${
          config?.global?.size?.labelFontSize ?? 'var(--panel-font-size)'
        }`,
        '--panel-label-line-height': `${
          config?.global?.size?.labelLineHeight ?? 'var(--panel-line-height-xs)'
        }`,

        //icon
        //icon-sizing
        '--panel-icon-size': `${config?.global?.size?.iconSize ?? '20px'}`,
        '--panel-icon-size-sm': `${config?.global?.size?.iconSizeSm ?? '24px'}`,
        '--panel-icon-secondary-size': `${
          config?.global?.size?.iconSecondarySize ?? '16px'
        }`,
        '--panel-icon-secondary-size-sm': `${
          config?.global?.size?.iconSecondarySizeSm ?? '16px'
        }`,
        //icon-colors
        '--panel-icon-color': `${
          config?.global?.color?.colorIcon ?? 'var(--panel-content-color)'
        }`,

        //notification
        '--panel-notification-bg': `${
          config?.component?.notification?.color?.colorBg ??
          'var(--panel-secondary-color)'
        }`,

        //popup
        //popup-color
        '--panel-popup-content-color': `${
          config?.component?.popup?.color?.colorText ??
          'var(--panel-secondary-content-color)'
        }`,
        '--panel-popup-bg': `${
          config?.component?.popup?.color?.colorBg ??
          'var(--panel-secondary-color)'
        }`,
        '--panel-popup-border-color': `${
          config?.component?.popup?.color?.colorBorder ??
          'var(--panel-secondary-content-color)'
        }`,
        //popup-typography
        '--panel-popup-font-size': `${
          config?.component?.popup?.size?.fontSize ??
          config?.global?.size?.fontSizeXs ??
          '12px'
        }`,

        //popup-list
        //popup-list-color
        '--panel-popup-list-header-bg': `${
          config?.component?.popupList?.color?.headerBg ?? COLORS.DARK['800']
        }`,
        '--panel-popup-list-item-bg-even': `${
          config?.component?.popupList?.color?.itemBgEven ?? 'transparent'
        }`,
        '--panel-popup-list-item-bg-odd': `${
          config?.component?.popupList?.color?.itemBgOdd ?? COLORS.DARK['400']
        }`,

        // tab-group
        //tab-group-spacing
        '--panel-tab-group-px': `${
          config?.component?.tabGroup?.size?.px ??
          'calc(var(--panel-spacer) * 6)'
        }`,

        //tab-list
        //tab-list-color
        '--panel-tab-list-bg': `${
          config?.component?.tabList?.color?.colorBg ?? COLORS.DARK.DEFAULT
        }`,
        //tab-list-spacing
        '--panel-tab-list-px': `${
          config?.component?.tabList?.size?.px ??
          'calc(var(--panel-spacer) * 3)'
        }`,
        '--panel-tab-list-py': `${
          config?.component?.tabList?.size?.py ??
          'calc(var(--panel-spacer) * 2)'
        }`,
        //tab-list-sizing
        '--panel-tab-list-radius': `${
          config?.component?.tabList?.style?.radius ??
          'var(--panel-radius-secondary)'
        }`,

        //tab-content
        //tab-content-spacing
        '--panel-content-pt': `${
          config?.component?.tabContent?.size?.pt ??
          'calc(var(--panel-spacer) * 2)'
        }`,
        '--panel-content-pb': `calc(var(--panel-spacer) * 9)`,
        '--panel-content-px': `${
          config?.component?.tabContent?.size?.px ?? '0px'
        }`,
        '--panel-content-gap': `${
          config?.component?.tabContent?.size?.gap ??
          'calc(var(--panel-gap) * 2)'
        }`,

        // tab
        // tab-spacing
        '--panel-tab-px': `${
          config?.component?.tab?.size?.px ?? 'calc(var(--panel-spacer) * 9)'
        }`,
        '--panel-tab-py': `${
          config?.component?.tab?.size?.py ?? 'calc(var(--panel-spacer) * 2)'
        }`,
        // tab-color
        '--panel-tab-bg': `${
          config?.component?.tab?.color?.colorBg ?? 'var(--panel-neutral-color)'
        }`,
        '--panel-tab-content-color': `${
          config?.component?.tab?.color?.colorText ??
          'var(--panel-neutral-content-color)'
        }`,
        '--panel-tab-select-content-color': `${
          config?.component?.tab?.color?.selectColorText ??
          'var(--panel-content-color)'
        }`,
        '--panel-tab-hover-content-color': `${
          config?.component?.tab?.color?.colorTextHover ??
          'var(--panel-content-hover-color)'
        }`,
        // tab-typography
        '--panel-tab-font-size': `${
          config?.component?.tab?.size?.fontSize ?? 'var(--panel-font-size-sm)'
        }`,
        '--panel-tab-font-weight': `${
          config?.component?.tab?.style?.fontWeight ??
          'var(--panel-font-weight-medium)'
        }`,
        '--panel-tab-line-height': `${
          config?.component?.tab?.style?.lineHeight ??
          'var(--panel-line-height-sm)'
        }`,

        // balance
        // balance-spacing
        '--panel-balance-group-px': `${
          config?.component?.balance?.size?.px ??
          'calc(var(--panel-spacer) * 6)'
        }`,
        '--panel-balance-group-gap': `${
          config?.component?.balance?.size?.gap ?? 'var(--panel-gap)'
        }`,
        // balance-color
        '--panel-balance-content-color': `${
          config?.component?.balance?.color?.colorText ??
          'var(--panel-secondary-content-color)'
        }`,
        '--panel-balance-price-content-color': `${
          config?.component?.balance?.color?.priceColorText ??
          'var(--panel-secondary-content-color)'
        }`,

        // balance-typography
        '--panel-balance-font-size': `${
          config?.component?.balance?.size?.fontSize ??
          'var(--panel-font-size-xs)'
        }`,
        '--panel-balance-line-height': `${
          config?.component?.balance?.size?.lineHeight ??
          'var(--panel-line-height-xs)'
        }`,
        '--panel-balance-price-font-size': `${
          config?.component?.balance?.size?.priceFontSize ??
          'var(--panel-font-size)'
        }`,
        '--panel-balance-price-line-height': `${
          config?.component?.balance?.size?.priceLineHeight ??
          'var(--panel-line-height)'
        }`,

        //inputs
        //inputs-size
        '--panel-inputs-group-gap': `${
          config?.component?.inputGroup?.size?.gap ?? 'var(--panel-gap)'
        }`,
        '--panel-inputs-group-px': `${
          config?.component?.inputGroup?.size?.px ??
          'calc(var(--panel-spacer) * 6)'
        }`,
        '--panel-inputs-group-px-arrow': `${
          config?.component?.inputGroup?.size?.pxArrow ?? 'var(--panel-spacer)'
        }`,
        '--panel-inputs-group-py-arrow': `${
          config?.component?.inputGroup?.size?.pyArrow ?? 'var(--panel-spacer)'
        }`,
        '--panel-inputs-group-arrow-size': `${
          config?.component?.inputGroup?.size?.arrowSize ??
          'var(--panel-input-token-icon-size)'
        }`,
        //inputs-color
        '--panel-inputs-arrow-bg': `${
          config?.component?.inputGroup?.color?.colorBgArrow ??
          'var(--panel-input-bg)'
        }`,
        '--panel-inputs-arrow-color': `${
          config?.component?.inputGroup?.color?.colorArrow ??
          'var(--panel-input-content-color)'
        }`,
        '--panel-inputs-arrow-border-color': `${
          config?.component?.inputGroup?.color?.colorBorderArrow ??
          'var(--panel-input-border-color)'
        }`,
        //inputs-style
        '--panel-inputs-arrow-radius': `${
          config?.component?.inputGroup?.style?.radiusArrow ??
          'var(--panel-radius-secondary)'
        }`,

        //input
        //input-sizing
        '--panel-input-radius': `${
          config?.component?.input?.style?.radius ?? 'var(--panel-radius)'
        }`,
        //input-spacing
        '--panel-input-group-gap': `${
          config?.component?.input?.size?.gap ?? 'calc(var(--panel-gap) * 2)'
        }`,
        '--panel-input-px': `${
          config?.component?.input?.size?.px ?? 'calc(var(--panel-spacer) * 3)'
        }`,
        '--panel-input-py': `${
          config?.component?.input?.size?.py ?? 'calc(var(--panel-spacer) * 2)'
        }`,
        '--panel-input-price-gap': `${
          config?.component?.input?.size?.priceGap ??
          'calc(var(--panel-gap) * 2)'
        }`,
        '--panel-input-token-icon-size': `${
          config?.component?.input?.size?.iconSize ?? 'var(--panel-icon-size)'
        }`,
        '--panel-input-token-icon-size-sm': `${
          config?.component?.input?.size?.iconSizeSm ??
          'var(--panel-icon-size-sm)'
        }`,
        //input-color
        '--panel-input-content-color': `${
          config?.component?.input?.color?.textColor ??
          'var(--panel-content-color)'
        }`,
        '--panel-input-loading-content-color': `${
          config?.component?.input?.color?.loadingTextColor ??
          'var(--panel-loading-content-color)'
        }`,
        '--panel-input-bg': `${
          config?.component?.input?.color?.bgColor ??
          'var(--panel-neutral-color)'
        }`,
        '--panel-input-focus-bg': `${
          config?.component?.input?.color?.bgColorFocus ?? 'transparent'
        }`,
        '--panel-input-border-color': `${
          config?.component?.input?.color?.borderColor ?? COLORS.GRAY[700]
        }`,
        '--panel-input-focus-border-color': `${
          config?.component?.input?.color?.borderColorFocus ??
          'var(--panel-content-color)'
        }`,
        '--panel-input-placeholder-color': `${
          config?.component?.input?.color?.placeholderColor ??
          'var(--panel-secondary-content-color)'
        }`,
        //input-typography
        '--panel-input-label-font-size': `${
          config?.component?.input?.size?.labelFontSize ??
          'var(--panel-font-size-sm)'
        }`,
        '--panel-input-label-line-height': `${
          config?.component?.input?.size?.labelLineHeight ??
          'var(--panel-line-height-sm)'
        }`,
        '--panel-input-label-font-weight': `${
          config?.component?.input?.style?.labelFontWeight ??
          'var(--panel-font-weight-light)'
        }`,

        '--panel-input-font-size': `${
          config?.component?.input?.size?.fontSize ??
          'var(--panel-font-size-sm)'
        }`,
        '--panel-input-line-height': `${
          config?.component?.input?.size?.lineHeight ??
          'var(--panel-line-height-sm)'
        }`,

        '--panel-input-font-size-lg': `${
          config?.component?.input?.size?.fontSizeLg ??
          'var(--panel-font-size-lg)'
        }`,
        '--panel-input-line-height-lg': `${
          config?.component?.input?.size?.lineHeightLg ??
          'var(--panel-line-height-lg)'
        }`,
        '--panel-input-font-weight': `${
          config?.component?.input?.style?.fontWeight ??
          'var(--panel-font-weight-light)'
        }`,

        '--panel-input-token-font-size': `${
          config?.component?.input?.size?.tokenFontSize ??
          'var(--panel-font-size-xs)'
        }`,
        '--panel-input-token-line-height': `${
          config?.component?.input?.size?.tokenLineHeight ??
          'var(--panel-line-height-xs)'
        }`,

        '--panel-input-token-font-size-sm': `${
          config?.component?.input?.size?.tokenFontSizeSm ??
          'var(--panel-font-size)'
        }`,
        '--panel-input-token-line-height-sm': `${
          config?.component?.input?.size?.tokenLineHeightSm ??
          'var(--panel-line-height)'
        }`,
        '--panel-input-token-font-weight': `${
          config?.component?.input?.style?.tokenFontWeight ??
          'var(--panel-font-weight-medium)'
        }`,

        //input-button
        //input-button-spacing
        '--panel-input-button-radius': `${
          config?.component?.input?.style?.buttonRadius ?? '30px'
        }`,
        '--panel-input-button-px': `${
          config?.component?.input?.size?.buttonPx ??
          'calc(var(--panel-spacer) * 2)'
        }`,
        '--panel-input-button-py': `${
          config?.component?.input?.size?.buttonPy ?? 'var(--panel-spacer)'
        }`,
        //input-button-color
        '--panel-input-button-bg': `${
          config?.component?.input?.color?.buttonBgColor ??
          'var(--panel-secondary-color)'
        }`,
        '--panel-input-button-border-color': `${
          config?.component?.input?.color?.buttonBorderColor ??
          'var(--panel-accent-to-color)'
        }`,
        '--panel-input-button-content-color': `${
          config?.component?.input?.color?.buttonTextColor ??
          'var(--panel-content-color)'
        }`,
        //input-button-typography
        '--panel-input-button-font-size': `${
          config?.component?.input?.size?.buttonFontSize ??
          'var(--panel-font-size-xs)'
        }`,
        '--panel-input-button-line-height': `${
          config?.component?.input?.size?.buttonLineHeight ??
          'var(--panel-line-height-xs)'
        }`,

        //action-button
        //action-button-spacing
        '--panel-action-accent-button-border-width': `${
          config?.component?.actionButton?.size?.borderWidth ?? '1px'
        }`,
        //action-button-color
        '--panel-action-accent-button-bg-from': `${
          config?.component?.actionButton?.color?.colorBgFrom ??
          'var(--panel-accent-from-color)'
        }`,
        '--panel-action-accent-button-bg-to': `${
          config?.component?.actionButton?.color?.colorBgTo ??
          'var(--panel-accent-to-color)'
        }`,
        '--panel-action-accent-button-hover-bg-from': `${
          config?.component?.actionButton?.color?.colorBgFromHover ??
          'var(--panel-accent-hover-from-color)'
        }`,
        '--panel-action-accent-button-hover-bg-to': `${
          config?.component?.actionButton?.color?.colorBgToHover ??
          'var(--panel-accent-hover-to-color)'
        }`,
        '--panel-action-accent-button-border-color': `${
          config?.component?.actionButton?.color?.colorBorder ??
          'var(--panel-accent-from-color)'
        }`,
        '--panel-action-accent-button-color': `${
          config?.component?.actionButton?.color?.colorText ??
          'var(--panel-accent-content-color)'
        }`,

        '--panel-action-outline-button-border-color': `${
          config?.component?.actionButton?.color?.outlineColorBorder ??
          `${COLORS.WHITE.DEFAULT}33`
        }`,
        '--panel-action-outline-button-border-hover-color': `${
          config?.component?.actionButton?.color?.outlineColorBorderHover ??
          `${COLORS.WHITE.DEFAULT}CC`
        }`,
        '--panel-action-outline-button-color': `${
          config?.component?.actionButton?.color?.outlineColorText ??
          'var(--panel-content-color)'
        }`,

        //meta
        //meta-spacing
        '--panel-meta-group-gap': `${
          config?.component?.meta?.size?.gap ?? 'var(--panel-gap)'
        }`,
        '--panel-meta-group-px': `${
          config?.component?.meta?.size?.px ?? 'calc(var(--panel-spacer) * 6)'
        }`,
        //meta-color
        '--panel-meta-link-color': `${
          config?.component?.meta?.color?.linkTextColor ??
          'var(--panel-accent-from-color)'
        }`,
        '--panel-meta-hover-bg': `${
          config?.component?.meta?.color?.panelBgHover ??
          'var(--panel-neutral-color)'
        }`,

        //tooltip
        //tooltip-color
        '--panel-tooltip-bg': `${
          config?.component?.tooltip?.color?.colorBg ?? COLORS.DARK['700']
        }`,
        '--panel-tooltip-color': `${
          config?.component?.tooltip?.color?.colorText ?? COLORS.WHITE.DEFAULT
        }`,

        //switch
        //switch-color
        '--panel-switch-bg-checked': `${
          config?.component?.switch?.color?.colorBgChecked ??
          COLORS.BLUE.DEFAULT
        }`,
        '--panel-switch-bg': `${
          config?.component?.switch?.color?.colorBg ?? COLORS.GRAY['700']
        }`,
        '--panel-switch-thumb-bg-checked': `${
          config?.component?.switch?.color?.colorThumbBgChecked ??
          COLORS.WHITE.DEFAULT
        }`,
        '--panel-switch-thumb-bg': `${
          config?.component?.switch?.color?.colorThumbBg ?? COLORS.WHITE.DEFAULT
        }`,
        '--panel-switch-color-checked':
          config?.component?.switch?.color?.colorChecked,
        '--panel-switch-color': config?.component?.switch?.color?.color,

        //checkbox
        //checkbox-color
        '--panel-checkbox-bg-checked': `${
          config?.component?.checkbox?.color?.colorBgChecked ??
          COLORS.GRAY['700']
        }`,
        '--panel-checkbox-bg': `${
          config?.component?.checkbox?.color?.colorBg ?? 'transparent'
        }`,
        '--panel-checkbox-border-color-checked': `${
          config?.component?.checkbox?.color?.colorBorder ?? 'transparent'
        }`,
        '--panel-checkbox-border-color': `${
          config?.component?.checkbox?.color?.colorBorderChecked ??
          COLORS.GRAY.DEFAULT
        }`,
        '--panel-checkbox-color': `${config?.component?.checkbox?.color?.color ?? COLORS.GRAY['300']}`,
        //checkbox-size
        '--panel-checkbox-size': `${config?.component?.checkbox?.size?.size ?? '20px'}`,
        '--panel-checkbox-icon-size': `${config?.component?.checkbox?.size?.iconSize ?? '16px'}`,
        //checkbox-style
        '--panel-checkbox-radius': `${config?.component?.checkbox?.style?.radius ?? '4px'}`,
      }}
    >
      {children}
    </div>
  )
}
