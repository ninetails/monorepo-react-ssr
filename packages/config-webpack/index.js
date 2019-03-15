const { readFileSync } = require('fs')
const { join } = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const definePluginFactory = require('./helpers/definePluginFactory')

const mode = process.env.NODE_ENV || 'development'
const isProd = mode === 'production'
const ifProd = (a, b) => isProd ? a : b
const isDev = mode === 'development'
const ifDev = (a, b) => isDev ? a : b

const dist = join(process.cwd(), 'dist')

const devtool = ifDev('inline-module-source-map', 'source-map')
const clientFilename = ifProd('assets/[name].[contenthash:8].js', 'assets/[name].js')

const customEnvVars = ['ASSET_PATH']

const babelConfig = JSON.parse(readFileSync(process.env.BABELRC || join(__dirname, '.babelrc'), 'utf8'))

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry:
      ifDev(['webpack-hot-middleware/client?name=client&reload=true'], [])
        .concat([
          'idempotent-babel-polyfill',
          join(process.cwd(), 'src', 'client.js')
        ]),
    output: {
      path: `${dist}/client`,
      publicPath: process.env.ASSET_PATH || '/',
      filename: clientFilename
    },
    mode,
    devtool,
    node: {
      process: false
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelConfig
          }
        }
      ]
    },
    optimization: {
      minimizer:
        ifProd(
          [
            new UglifyJsPlugin({
              sourceMap: true,
              uglifyOptions: {
                output: {
                  comments: false
                }
              }
            })
          ],
          []
        ),
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules\/(?!react|core-js)/,
            chunks: 'initial',
            name: 'vendor',
            enforce: true
          },
          react: {
            test: /node_modules\/react/,
            chunks: 'initial',
            name: 'react',
            enforce: true
          },
          corejs: {
            test: /node_modules\/core-js/,
            chunks: 'initial',
            name: 'corejs',
            enforce: true
          }
        }
      }
    },
    plugins: [
      ifDev(new webpack.HotModuleReplacementPlugin({ multiStep: true }), () => undefined),
      new StatsWriterPlugin({
        filename: 'stats.json'
      }),
      definePluginFactory(customEnvVars)
    ]
  },
  {
    name: 'server',
    target: 'node',
    entry:
      ifDev(['webpack-hot-middleware/client?name=server'], [])
        .concat([
          'idempotent-babel-polyfill',
          join(process.cwd(), 'src', 'express.js')
        ]),
    output: {
      path: dist,
      filename: 'server.js',
      libraryTarget: 'commonjs2'
    },
    mode,
    devtool,
    node: {
      process: false
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelConfig
          }
        }
      ]
    },
    plugins: [
      ifDev(new webpack.HotModuleReplacementPlugin(), () => undefined),
      definePluginFactory(customEnvVars)
    ]
  }
]
