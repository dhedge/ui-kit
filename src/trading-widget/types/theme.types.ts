export const THEME_TYPE = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
  DEFAULT: 'default',
  CUSTOM: 'custom',
} as const

export type ThemeType = (typeof THEME_TYPE)[keyof typeof THEME_TYPE]

export type TokenIconSize = 'xs' | 'sm' | 'm' | 'lg' | 'xl'
