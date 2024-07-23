const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')
const { join } = require('path')
const { COLORS } = require(join(__dirname, 'src', 'theme', 'colors.js'))

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
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
        'arrow-top': `${COLORS.GRAY['700']} transparent transparent transparent`,
        'arrow-right': `transparent ${COLORS.GRAY['700']} transparent transparent`,
        'arrow-bottom': `transparent transparent ${COLORS.GRAY['700']} transparent`,
        'arrow-left': `transparent transparent transparent ${COLORS.GRAY['700']}`,
      },
    },
  },
  plugins: [],
  prefix: 'dtw-',
  corePlugins: {
    preflight: false,
  },
}
