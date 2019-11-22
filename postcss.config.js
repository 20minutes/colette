module.exports = ({ env }) => ({
  plugins: {
    'postcss-custom-properties': {
      preserve: true,
    },
    'postcss-focus-visible': {},
    cssnano: {
      autoprefixer: env === 'production',
      mergeRules: false, // mergeRules make :focus-visible buggy, keep it false
      minifyFontValues: {
        removeQuotes: false,
      },
      calc: false,
    },
  },
})
