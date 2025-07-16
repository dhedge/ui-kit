import type { FC, PropsWithChildren } from 'react'

import type { ThemeProviderProps } from 'limit-orders/providers/theme-provider/theme-provider.types'
import { COLORS } from 'theme/colors'

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
        '--limit-order-radius': `${config?.global?.style?.radiusPrimary ?? `1rem`}`,
        '--limit-order-radius-secondary': `${
          config?.global?.style?.radiusSecondary ?? `1rem`
        }`,

        //widget background
        '--limit-order-background-color': `${
          config?.global?.color?.colorBgPrimary ?? COLORS.DARK['800']
        }`,

        //global-size
        '--limit-order-gap': `${config?.global?.size?.gap ?? `0.25rem`}`,
        '--limit-order-spacer': `${config?.global?.size?.spacer ?? `4px`}`,

        //global-color
        '--limit-order-content-color': `${
          config?.global?.color?.colorTextPrimary ?? COLORS.WHITE.DEFAULT
        }`,
        '--limit-order-content-hover-color': `${
          config?.global?.color?.colorTextPrimaryHover ??
          `${COLORS.WHITE.DEFAULT}CC`
        }`,

        '--limit-order-secondary-color': `${
          config?.global?.color?.colorBgSecondary ?? COLORS.GRAY['800']
        }`,
        '--limit-order-secondary-content-color': `${
          config?.global?.color?.colorTextSecondary ?? COLORS.GRAY['600']
        }`,

        '--limit-order-accent-from-color': `${
          config?.global?.color?.colorBgAccentFrom ?? COLORS.GREEN.DEFAULT
        }`,
        '--limit-order-accent-to-color': `${
          config?.global?.color?.colorBgAccentTo ?? COLORS.GREEN['700']
        }`,
        '--limit-order-accent-hover-from-color': `${
          config?.global?.color?.colorBgAccentFromHover ??
          `${COLORS.GREEN.DEFAULT}CC`
        }`,
        '--limit-order-accent-hover-to-color': `${
          config?.global?.color?.colorBgAccentToHover ?? COLORS.BLUE.dark
        }`,
        '--limit-order-accent-content-color': `${
          config?.global?.color?.colorTextAccent ?? COLORS.WHITE.DEFAULT
        }`,
        '--limit-order-accent-content-hover-color': `${
          config?.global?.color?.colorTextAccentHover ??
          `${COLORS.WHITE.DEFAULT}CC`
        }`,

        '--limit-order-neutral-color': `${
          config?.global?.color?.colorBgNeutral ?? `${COLORS.GRAY['600']}33`
        }`,
        '--limit-order-neutral-content-color': `${
          config?.global?.color?.colorTextNeutral ?? `${COLORS.GRAY['600']}80`
        }`,

        '--limit-order-loading-content-color': `${
          config?.global?.color?.colorTextLoading ?? `${COLORS.WHITE.DEFAULT}99`
        }`,

        '--limit-order-error-content-color': `${
          config?.global?.color?.colorTextError ?? COLORS.RED['500']
        }`,

        '--limit-order-warning-content-color': `${
          config?.global?.color?.colorTextWarning ?? COLORS.AMBER['400']
        }`,

        '--limit-order-border-color': `${
          config?.global?.color?.colorBorderPrimary ??
          `var(--limit-order-content-color)`
        }`,

        //scrollbar
        '--limit-order-scrollbar-color': `${
          config?.global?.color?.colorScrollbar ?? `${COLORS.GREEN.DEFAULT}80`
        }`,

        //global-size
        '--limit-order-font-size': `${config?.global?.size?.fontSizeBase ?? '16px'}`,
        '--limit-order-line-height': `${
          config?.global?.size?.lineHeightBase ?? '24px'
        }`,

        '--limit-order-font-size-lg': `${config?.global?.size?.fontSizeLg ?? '18px'}`,
        '--limit-order-line-height-lg': `${
          config?.global?.size?.lineHeightLg ?? '28px'
        }`,

        '--limit-order-font-size-sm': `${config?.global?.size?.fontSizeSm ?? '14px'}`,
        '--limit-order-line-height-sm': `${
          config?.global?.size?.lineHeightSm ?? '20px'
        }`,

        '--limit-order-font-size-xs': `${config?.global?.size?.fontSizeXs ?? '12px'}`,
        '--limit-order-line-height-xs': `${
          config?.global?.size?.lineHeightXs ?? '16px'
        }`,

        //global-style
        '--limit-order-font-weight-light': `${
          config?.global?.style?.fontWeightLight ?? 300
        }`,
        '--limit-order-font-weight-medium': `${
          config?.global?.style?.fontWeightMedium ?? 500
        }`,
        '--limit-order-font-weight-bold': `${
          config?.global?.style?.fontWeightBold ?? 700
        }`,

        '--limit-order-action-opacity': `${
          config?.global?.style?.actionOpacity ?? 1
        }`,
        '--limit-order-action-hover-opacity': `${
          config?.global?.style?.actionOpacityHover ?? 0.8
        }`,

        //label
        //label-typography
        '--limit-order-label-font-size': `${
          config?.global?.size?.labelFontSize ??
          'var(--limit-order-font-size-xs)'
        }`,
        '--limit-order-label-line-height': `${
          config?.global?.size?.labelLineHeight ??
          'var(--limit-order-line-height-xs)'
        }`,

        //action-button
        //action-button-spacing
        '--limit-order-action-accent-button-border-width': `${
          config?.component?.actionButton?.size?.borderWidth ?? '1px'
        }`,
        //action-button-color
        '--limit-order-action-accent-button-bg-from': `${
          config?.component?.actionButton?.color?.colorBgFrom ??
          'var(--limit-order-accent-from-color)'
        }`,
        '--limit-order-action-accent-button-bg-to': `${
          config?.component?.actionButton?.color?.colorBgTo ??
          'var(--limit-order-accent-to-color)'
        }`,
        '--limit-order-action-accent-button-hover-bg-from': `${
          config?.component?.actionButton?.color?.colorBgFromHover ??
          'var(--limit-order-accent-hover-from-color)'
        }`,
        '--limit-order-action-accent-button-hover-bg-to': `${
          config?.component?.actionButton?.color?.colorBgToHover ??
          'var(--limit-order-accent-hover-to-color)'
        }`,
        '--limit-order-action-accent-button-border-color': `${
          config?.component?.actionButton?.color?.colorBorder ??
          'var(--limit-order-accent-from-color)'
        }`,
        '--limit-order-action-accent-button-color': `${
          config?.component?.actionButton?.color?.colorText ??
          'var(--limit-order-accent-content-color)'
        }`,

        '--limit-order-action-outline-button-border-color': `${
          config?.component?.actionButton?.color?.outlineColorBorder ??
          `${COLORS.WHITE.DEFAULT}33`
        }`,
        '--limit-order-action-outline-button-border-hover-color': `${
          config?.component?.actionButton?.color?.outlineColorBorderHover ??
          `${COLORS.WHITE.DEFAULT}CC`
        }`,
        '--limit-order-action-outline-button-color': `${
          config?.component?.actionButton?.color?.outlineColorText ??
          'var(--limit-order-content-color)'
        }`,

        //icon
        //icon-sizing
        '--limit-order-icon-size': `${config?.global?.size?.iconSize ?? '20px'}`,
        '--limit-order-icon-size-sm': `${config?.global?.size?.iconSizeSm ?? '24px'}`,
        '--limit-order-icon-secondary-size': `${
          config?.global?.size?.iconSecondarySize ?? '16px'
        }`,
        '--limit-order-icon-secondary-size-sm': `${
          config?.global?.size?.iconSecondarySizeSm ?? '16px'
        }`,
        //icon-colors
        '--limit-order-icon-color': `${
          config?.global?.color?.colorIcon ?? 'var(--limit-order-content-color)'
        }`,

        //inputs
        '--limit-order-inputs-group-gap': `${
          config?.component?.inputGroup?.size?.gap ?? 'var(--limit-order-gap)'
        }`,
        '--limit-order-inputs-group-px': `${
          config?.component?.inputGroup?.size?.px ??
          'calc(var(--limit-order-spacer) * 3)'
        }`,

        //input
        //input-sizing
        '--limit-order-input-radius': `${
          config?.component?.input?.style?.radius ?? 'var(--limit-order-radius)'
        }`,
        //input-spacing
        '--limit-order-input-group-gap': `${
          config?.component?.input?.size?.gap ??
          'calc(var(--limit-order-gap) * 2)'
        }`,
        '--limit-order-input-px': `${
          config?.component?.input?.size?.px ??
          'calc(var(--limit-order-spacer) * 3)'
        }`,
        '--limit-order-input-py': `${
          config?.component?.input?.size?.py ??
          'calc(var(--limit-order-spacer) * 2)'
        }`,
        '--limit-order-input-price-gap': `${
          config?.component?.input?.size?.priceGap ??
          'calc(var(--limit-order-gap) * 2)'
        }`,
        '--limit-order-input-token-icon-size': `${
          config?.component?.input?.size?.iconSize ??
          'var(--limit-order-icon-size)'
        }`,
        '--limit-order-input-token-icon-size-sm': `${
          config?.component?.input?.size?.iconSizeSm ??
          'var(--limit-order-icon-size-sm)'
        }`,
        //input-color
        '--limit-order-input-content-color': `${
          config?.component?.input?.color?.textColor ??
          'var(--limit-order-secondary-content-color)'
        }`,
        '--limit-order-input-loading-content-color': `${
          config?.component?.input?.color?.loadingTextColor ??
          'var(--limit-order-loading-content-color)'
        }`,
        '--limit-order-input-bg': `${
          config?.component?.input?.color?.bgColor ??
          'var(--limit-order-neutral-color)'
        }`,
        '--limit-order-input-focus-bg': `${
          config?.component?.input?.color?.bgColorFocus ?? 'transparent'
        }`,
        '--limit-order-input-border-color': `${
          config?.component?.input?.color?.borderColor ?? COLORS.GRAY[700]
        }`,
        '--limit-order-input-focus-border-color': `${
          config?.component?.input?.color?.borderColorFocus ??
          'var(--limit-order-content-color)'
        }`,
        '--limit-order-input-placeholder-color': `${
          config?.component?.input?.color?.placeholderColor ??
          'var(--limit-order-secondary-content-color)'
        }`,
        //input-typography
        '--limit-order-input-label-font-size': `${
          config?.component?.input?.size?.labelFontSize ??
          'var(--limit-order-font-size)'
        }`,
        '--limit-order-input-label-line-height': `${
          config?.component?.input?.size?.labelLineHeight ??
          'var(--limit-order-line-height)'
        }`,
        '--limit-order-input-label-font-weight': `${
          config?.component?.input?.style?.labelFontWeight ??
          'var(--limit-order-font-weight-light)'
        }`,

        '--limit-order-input-font-size': `${
          config?.component?.input?.size?.fontSize ??
          'var(--limit-order-font-size-sm)'
        }`,
        '--limit-order-input-line-height': `${
          config?.component?.input?.size?.lineHeight ??
          'var(--limit-order-line-height-sm)'
        }`,

        '--limit-order-input-font-size-lg': `${
          config?.component?.input?.size?.fontSizeLg ??
          'var(--limit-order-font-size-lg)'
        }`,
        '--limit-order-input-line-height-lg': `${
          config?.component?.input?.size?.lineHeightLg ??
          'var(--limit-order-line-height-lg)'
        }`,
        '--limit-order-input-suffix-font-size': `${
          config?.component?.input?.size?.suffixFontSize ??
          'var(--limit-order-font-size-sm)'
        }`,
        '--limit-order-input-font-weight': `${
          config?.component?.input?.style?.fontWeight ??
          'var(--limit-order-font-weight-light)'
        }`,

        '--limit-order-input-token-font-size': `${
          config?.component?.input?.size?.tokenFontSize ??
          'var(--limit-order-font-size-xs)'
        }`,
        '--limit-order-input-token-line-height': `${
          config?.component?.input?.size?.tokenLineHeight ??
          'var(--limit-order-line-height-xs)'
        }`,

        '--limit-order-input-token-font-size-sm': `${
          config?.component?.input?.size?.tokenFontSizeSm ??
          'var(--limit-order-font-size)'
        }`,
        '--limit-order-input-token-line-height-sm': `${
          config?.component?.input?.size?.tokenLineHeightSm ??
          'var(--limit-order-line-height)'
        }`,
        '--limit-order-input-token-font-weight': `${
          config?.component?.input?.style?.tokenFontWeight ??
          'var(--limit-order-font-weight-medium)'
        }`,

        //input-button
        //input-button-spacing
        '--limit-order-input-button-radius': `${
          config?.component?.input?.style?.buttonRadius ?? '30px'
        }`,
        '--limit-order-input-button-px': `${
          config?.component?.input?.size?.buttonPx ??
          'calc(var(--limit-order-spacer) * 2)'
        }`,
        '--limit-order-input-button-py': `${
          config?.component?.input?.size?.buttonPy ??
          'var(--limit-order-spacer)'
        }`,
        //input-button-color
        '--limit-order-input-button-bg': `${
          config?.component?.input?.color?.buttonBgColor ??
          'var(--limit-order-secondary-color)'
        }`,
        '--limit-order-input-button-border-color': `${
          config?.component?.input?.color?.buttonBorderColor ??
          'var(--limit-order-accent-to-color)'
        }`,
        '--limit-order-input-button-content-color': `${
          config?.component?.input?.color?.buttonTextColor ??
          'var(--limit-order-content-color)'
        }`,
        //input-button-typography
        '--limit-order-input-button-font-size': `${
          config?.component?.input?.size?.buttonFontSize ??
          'var(--limit-order-font-size-xs)'
        }`,
        '--limit-order-input-button-line-height': `${
          config?.component?.input?.size?.buttonLineHeight ??
          'var(--limit-order-line-height-xs)'
        }`,

        //tooltip
        //tooltip-color
        '--limit-order-tooltip-bg': `${
          config?.component?.tooltip?.color?.colorBg ?? COLORS.DARK['700']
        }`,
        '--limit-order-tooltip-color': `${
          config?.component?.tooltip?.color?.colorText ?? COLORS.WHITE.DEFAULT
        }`,

        //switch-panel
        //switch-panel-color
        '--limit-order-switch-panel-border-color': `${
          config?.component?.switchPanel?.color?.colorBorder ??
          'var(--limit-order-action-accent-button-border-color)'
        }`,
        //switch-panel-style
        '--limit-order-switch-panel-radius': `${
          config?.component?.switchPanel?.style?.radius ??
          'var(--limit-order-input-radius)'
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
