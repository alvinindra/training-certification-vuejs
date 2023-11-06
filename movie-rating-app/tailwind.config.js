/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      secondary: '#121826',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      purple: colors.purple,
      indigo: colors.indigo,
      yellow: colors.yellow
    },
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
}
