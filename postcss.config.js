module.exports = ({ env }) => ({
  plugins: {
    cssnano: {
      autoprefixer: env === 'production',
      mergeRules: false, // mergeRules make :focus-visible buggy, keep it false
      minifyFontValues: {
        removeQuotes: false,
      },
      calc: false,
    },
    'postcss-focus-visible': {},
    'postcss-css-variables': {},
  },
})
