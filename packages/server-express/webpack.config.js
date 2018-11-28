const { join } = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const definePluginFactory = require('./helpers/definePluginFactory')

require('./loadenv')

const dist = join(__dirname, 'dist')

const mode = process.env.NODE_ENV || 'development'
const devtool =
  process.env.NODE_ENV === 'development'
    ? 'inline-module-source-map'
    : 'source-map'
const clientFilename =
  process.env.NODE_ENV === 'production'
    ? 'assets/[name].[hash].js'
    : 'assets/[name].js'

const customEnvVars = ['ASSET_PATH']

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry:
      process.env.NODE_ENV === 'production'
        ? [
          'idempotent-babel-polyfill',
          '@ninetails-monorepo-react-ssr/app/client.js'
        ]
        : [
          'webpack-hot-middleware/client?name=client&reload=true',
          'idempotent-babel-polyfill',
          '@ninetails-monorepo-react-ssr/app/client.js'
        ],
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
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    optimization: {
      minimizer:
        process.env.NODE_ENV === 'development'
          ? []
          : [
            new UglifyJsPlugin({
              sourceMap: true,
              uglifyOptions: {
                output: {
                  comments: false
                }
              }
            })
          ]
    },
    plugins: [
      process.env.NODE_ENV === 'production'
        ? () => undefined
        : new webpack.HotModuleReplacementPlugin(),
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
      process.env.NODE_ENV === 'production'
        ? [
          'idempotent-babel-polyfill',
          '@ninetails-monorepo-react-ssr/app/express.js'
        ]
        : [
          'idempotent-babel-polyfill',
          'webpack-hot-middleware/client?name=server',
          '@ninetails-monorepo-react-ssr/app/express.js'
        ],
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
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      process.env.NODE_ENV === 'production'
        ? () => undefined
        : new webpack.HotModuleReplacementPlugin(),
      definePluginFactory(customEnvVars)
    ]
  }
]
