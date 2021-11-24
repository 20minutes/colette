const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const KssWebpackPlugin = require('kss-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack')
const { createSprite } = require('svg-sprite-html-webpack/src/spriteUtils')
const kssConfig = require('./kss.json')

async function getSvgSprite() {
  const spriteGenerator = new SvgSpriteHtmlWebpackPlugin({
    includeFiles: ['./src/svg/**/*.svg'],
    generateSymbolId: (svgFilePath) => {
      const svgDir = path.resolve('./src/svg')
      const pathToSubDir = path.relative(svgDir, path.dirname(svgFilePath))
      const composed = pathToSubDir === '' ? [] : pathToSubDir.split(path.sep)
      composed.push(path.basename(svgFilePath, '.svg'))

      return `symbol-${composed.join('-')}`
    },
  })

  return createSprite(spriteGenerator.svgList)
}

module.exports = async (env) => {
  const config = {
    entry: {
      colette: './src/index.js',
    },
    output: {
      filename: '[name].min.js',
      libraryTarget: 'umd',
    },
    // mode: 'production',
    mode: 'development',
    devServer: {
      static: path.resolve(__dirname, './dist'),
      historyApiFallback: true,
      allowedHosts: ['all'],
      port: 8000,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /(\.jsx?|\.es6)$/,
          use: 'babel-loader',
        },
        {
          test: /\.styl$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            'postcss-loader',
            {
              loader: 'stylus-loader',
              options: {
                paths: ['node_modules'],
                'include css': true,
                'resolve url': true,
                stylus: {
                  preferPathResolver: 'webpack',
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.es6'],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].min.css',
      }),
    ],
  }

  if (!env || env.NODE_ENV !== 'dist') {
    // kss
    kssConfig.svgSprite = await getSvgSprite()
    config.plugins.push(new KssWebpackPlugin(kssConfig))

    // assets for kss demo
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'demo-img/',
            to: './img',
          },
          {
            from: 'src/fonts/',
            to: './fonts',
          },
          {
            from: 'favicon.ico',
            to: './',
          },
        ],
      })
    )
  }

  return config
}
