import { FC, PropsWithChildren } from 'react'

// TODO: fix import  from theme/colors.js
const COLORS = {
  SUCCESS: '#15fea6',
  ERROR: '#dd376a',
  WARNING: '#fbbf24',
  INFO: '#504c56',
  WHITE: {
    DEFAULT: '#ffffff',
  },
  DARK: {
    DEFAULT: '#181C25',
    400: '#2A3648',
    600: '#202937',
    700: '#12171F',
    800: '#1B2432',
    900: '#252F3D',
  },
  RED: {
    DEFAULT: '#B3585D',
    500: '#EF4444',
    600: '#B23737',
    700: '#B22550',
  },
  GRAY: {
    DEFAULT: '#B1B6C1',
    300: '#EBEBF0',
    400: '#CDCFD9',
    500: '#B4BCC7',
    600: '#9DA2AD',
    700: '#4C505B',
    800: '#2B313E',
  },
  GREEN: {
    DEFAULT: '#73D393',
    600: '#2E7050',
    700: '#34855E',
  },
  BLUE: {
    DEFAULT: '#152E4D',
    dark: '#162435',
  },
  AMBER: {
    400: '#AFA58D',
  },
  NETWORK: {
    polygon: '#8247e5',
    optimism: '#ff0420',
  },
}

interface ThemeProviderConfigProps {
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

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  config,
}) => {
  return (
    <div
      style={{
        //global-style
        // add custom CSS variables to d.ts
        // @ts-ignore
        '--panel-radius': `${config?.global?.style?.radiusPrimary ?? `1rem`}`,
        '--panel-radius-secondary': `${
          config?.global?.style?.radiusSecondary ?? `0.5rem`
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

        '--panel-border-color': `${
          config?.global?.color?.colorBorderPrimary ??
          `var('--panel-content-color)`
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
        '--panel-label-font-size': `var(--panel-font-size-xs)`,
        '--panel-label-line-height': `var(--panel-line-height-xs)`,

        //icon
        //icon-sizing
        '--panel-icon-size': `20px`,
        '--panel-icon-size-sm': `24px`,
        '--panel-icon-secondary-size': `16px`,
        '--panel-icon-secondary-size-sm': `16px`,
        //icon-colors
        '--panel-icon-color': `var(--panel-content-color)`,

        //popup
        //popup-color
        '--panel-popup-content-color': `var(--panel-secondary-content-color)`,
        '--panel-popup-bg': `var(--panel-secondary-color)`,
        '--panel-popup-border-color': `var(--panel-secondary-content-color)`,
        //popup-typography
        '--panel-popup-font-size': `12px`,

        // tab-group
        //tab-group
        '--panel-tab-group-px': `12px`,

        //tab-content
        //tab-content-spacing
        '--panel-content-pt': `calc(var(--panel-spacer) * 3)`,
        '--panel-content-pb': `calc(var(--panel-spacer) * 9)`,
        '--panel-content-px': `0px`,
        '--panel-content-gap': `calc(var(--panel-gap) * 2)`,

        // tab
        // tab-spacing
        '--panel-tab-px': `calc(var(--panel-spacer) * 3)`,
        '--panel-tab-py': `calc(var(--panel-spacer) * 2.5)`,
        // tab-color
        '--panel-tab-bg': `var(--panel-neutral-color)`,
        '--panel-tab-content-color': `var(--panel-neutral-content-color)`,
        '--panel-tab-select-content-color': `var(--panel-content-color)`,
        '--panel-tab-hover-content-color': `var(--panel-content-hover-color)`,
        // tab-typography
        '--panel-tab-font-size': `var(--panel-font-size-sm)`,
        '--panel-tab-font-weight': `var(--panel-font-weight-bold)`,
        '--panel-tab-line-height': `var(--panel-line-height-sm)`,

        // balance
        // balance-spacing
        '--panel-balance-group-px': `calc(var(--panel-spacer) * 3)`,
        '--panel-balance-group-gap': `var(--panel-gap)`,
        // balance-color
        '--panel-balance-content-color': `var(--panel-content-color)`,
        '--panel-balance-price-content-color': `var(
            --panel-secondary-content-color
          )`,

        // balance-typography
        '--panel-balance-font-size': `var(--panel-font-size-lg)`,
        '--panel-balance-line-height': `var(--panel-line-height-lg)`,
        '--panel-balance-price-font-size': `var(--panel-font-size)`,
        '--panel-balance-price-line-height': `var(--panel-line-height)`,

        //inputs
        '--panel-inputs-group-gap': `var(--panel-gap)`,
        '--panel-inputs-group-px': `calc(var(--panel-spacer) * 3)`,

        //input
        //input-sizing
        '--panel-input-radius': `var(--panel-radius)`,
        //input-spacing
        '--panel-input-group-gap': `calc(var(--panel-gap) * 2)`,
        '--panel-input-px': `calc(var(--panel-spacer) * 3)`,
        '--panel-input-py': `calc(var(--panel-spacer) * 2)`,
        '--panel-input-price-gap': `calc(var(--panel-gap) * 2)`,
        '--panel-input-token-icon-size': `var(--panel-icon-size)`,
        '--panel-input-token-icon-size-sm': `var(--panel-icon-size-sm)`,
        //input-color
        '--panel-input-content-color': `var(--panel-content-color)`,
        '--panel-input-loading-content-color': `var(
            --panel-loading-content-color
          )`,
        '--panel-input-bg': `var(--panel-neutral-color)`,
        '--panel-input-focus-bg': `transparent`,
        '--panel-input-border-color': `${COLORS.GRAY[700]}`,
        '--panel-input-focus-border-color': `var(--panel-content-color)`,
        '--panel-input-placeholder-color': `var(--panel-secondary-content-color)`,
        //input-typography
        '--panel-input-label-font-size': `var(--panel-font-size-sm)`,
        '--panel-input-label-line-height': `var(--panel-line-height-sm)`,
        '--panel-input-label-font-weight': `var(--panel-font-weight-light)`,

        '--panel-input-font-size': `var(--panel-font-size-sm)`,
        '--panel-input-line-height': `var(--panel-line-height-sm)`,

        '--panel-input-font-size-lg': `var(--panel-font-size-lg)`,
        '--panel-input-line-height-lg': `var(--panel-line-height-lg)`,
        '--panel-input-font-weight': `var(--panel-font-weight-light)`,

        '--panel-input-token-font-size': `var(--panel-font-size-xs)`,
        '--panel-input-token-line-height': `var(--panel-line-height-xs)`,

        '--panel-input-token-font-size-sm': `var(--panel-font-size)`,
        '--panel-input-token-line-height-sm': `var(--panel-line-height)`,
        '--panel-input-token-font-weight': `var(--panel-font-weight-medium)`,

        //input-button
        //input-button-spacing
        '--panel-input-button-radius': `30px`,
        '--panel-input-button-px': `calc(var(--panel-spacer) * 2)`,
        '--panel-input-button-py': `var(--panel-spacer)`,
        //input-button-color
        '--panel-input-button-bg': `var(--panel-secondary-color)`,
        '--panel-input-button-border-color': `var(--panel-accent-to-color)`,
        '--panel-input-button-content-color': `var(--panel-content-color)`,
        //input-button-typography
        '--panel-input-button-font-size': `var(--panel-font-size-xs)`,
        '--panel-input-button-line-height': `var(--panel-line-height-xs)`,

        //action-button
        //action-button-spacing
        '--panel-action-accent-button-border-width': `1px`,
        //action-button-color
        '--panel-action-accent-button-bg-from': `var(--panel-accent-from-color)`,
        '--panel-action-accent-button-bg-to': `var(--panel-accent-to-color)`,
        '--panel-action-accent-button-hover-bg-from': `var(
            --panel-accent-hover-from-color
          )`,
        '--panel-action-accent-button-hover-bg-to': `var(
            --panel-accent-hover-to-color
          )`,
        '--panel-action-accent-button-border-color': `var(
            --panel-accent-from-color
          )`,
        '--panel-action-accent-button-color': `var(--panel-accent-content-color)`,

        '--panel-action-outline-button-border-color': `${COLORS.WHITE.DEFAULT}33`,
        '--panel-action-outline-button-border-hover-color': `${COLORS.WHITE.DEFAULT}CC`,
        '--panel-action-outline-button-color': `var(--panel-content-color)`,

        //meta
        //meta-spacing
        '--panel-meta-group-gap': `var(--panel-gap)`,
        '--panel-meta-group-px': `calc(var(--panel-spacer) * 3)`,
        //meta-color
        '--panel-meta-link-color': `var(--panel-accent-from-color)`,
        '--panel-meta-hover-bg': `var(--panel-neutral-color)`,
      }}
    >
      {children}
    </div>
  )
}
