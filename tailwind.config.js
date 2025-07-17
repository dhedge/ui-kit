import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { COLORS } from './src/theme/colors.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(__dirname, 'src/**/*.{ts,tsx,html}')],
  theme: {
    extend: {
      colors: {
        success: COLORS.SUCCESS,
        error: COLORS.ERROR,
        warning: COLORS.WARNING,
        info: COLORS.INFO,
        themeDark: COLORS.DARK,
        themeRed: COLORS.RED,
        themeGray: COLORS.GRAY,
        themeGreen: COLORS.GREEN,
        themeBlue: COLORS.BLUE,
        themeAmber: COLORS.AMBER,
        network: COLORS.NETWORK,
      },
      borderColor: {
        'arrow-top': 'var(--panel-tooltip-bg) transparent transparent transparent',
        'arrow-right': 'transparent var(--panel-tooltip-bg) transparent transparent',
        'arrow-bottom': 'transparent transparent var(--panel-tooltip-bg) transparent',
        'arrow-left': 'transparent transparent transparent var(--panel-tooltip-bg)',
      },
    },
  },
  plugins: [],
  prefix: 'dtw-',
  corePlugins: {
    preflight: false,
  },
} 