module.exports = {
  exclude: [
    /\bcore-js\b/,
    /@babel\/runtime/,
  ],
  presets: [
    ['@babel/preset-env', {
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3,
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-strict-mode', {
      strict: true,
    }],
    '@babel/plugin-transform-runtime',
  ],
  sourceType: 'unambiguous',
}
