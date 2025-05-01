const path = require('path')

const IS_DEV = process.env.NODE_ENV === 'development'
const IS_PROD = !IS_DEV

const { ProvidePlugin } = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const SpritePlugin = require('svg-sprite-loader/plugin')
const CopyPlugin = require('copy-webpack-plugin')

const optimization = () => {
  const config = {}

  if (IS_PROD) {
    config.minimizer = [new miniCssExtractPlugin(), new TerserWebpackPlugin()]
  }

  return config
}

const fileLoaderConfig = (ext) => [
  {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: `${IS_PROD ? '/' : ''}assets/${ext}`,
    },
  },
]

const filename = (ext) => (IS_DEV ? `[name].${ext}` : `[name].[hash].${ext}`)

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [path.resolve(__dirname, 'src/styles')],
                sourceMap: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: fileLoaderConfig('fonts'),
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        exclude: path.resolve(__dirname, 'src/assets/sprite'),
        use: fileLoaderConfig('img'),
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/assets/sprite'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              outputPath: '/assets/sprite/',
            },
          },
          'svgo-loader',
        ],
      },
    ],
  },
  devtool: IS_DEV ? 'source-map' : false,
  optimization: optimization(),
  plugins: [
    new SpritePlugin(),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HTMLWebpackPlugin({
      template: './public/index.html',
      minify: {
        collapseWhitespace: IS_PROD,
      },
    }),

    new HTMLWebpackPlugin({
      template: './public/info/info.html',
      inject: 'body',
      filename: 'press-center.html',
      minify: {
        collapseWhitespace: IS_PROD,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/info/info-detail.html',
      inject: 'body',
      filename: 'press-detail.html',
      minify: {
        collapseWhitespace: IS_PROD,
      },
    }),

    new HTMLWebpackPlugin({
      template: './public/reports.html',
      inject: 'body',
      filename: 'press-detail.html',
      minify: {
        collapseWhitespace: IS_PROD,
      },
    }),

    new CopyPlugin({
      patterns: [
        { from: './src/assets/favicon', to: './assets/favicon' },
        { from: './src/assets/img', to: './assets/img' },
        { from: './src/assets/svg', to: './assets/svg' },
        { from: './src/assets/files', to: './assets/files' },
      ],
    }),
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
}

if (IS_DEV) {
  module.exports.devServer = {
    port: 3012,
    allowedHosts: 'all',
    client: {
      overlay: false,
    },
    hot: IS_DEV,
    compress: true,
    liveReload: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://x92617p0.beget.tech',
        secure: false,
        changeOrigin: true,
      },

      '/upload': {
        target: 'http://x92617p0.beget.tech',
        secure: false,
        changeOrigin: true,
      },
    },
  }
}
