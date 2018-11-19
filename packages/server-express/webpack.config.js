const { dirname, join } = require('path')
const webpack = require('webpack')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const babelConfig = require('@ninetails-monorepo-react-ssr/babel-preset-monorepo-react-ssr')
const { presets, plugins } = babelConfig()
const [ _, ...restPresets ] = presets // eslint-disable-line no-unused-vars

const dist = join(__dirname, 'dist')

const includePaths = [
  dirname(require.resolve('@ninetails-monorepo-react-ssr/app/package.json'))
]

const mode = process.env.NODE_ENV || 'development'
const devtool = process.env.NODE_ENV === 'development' ? 'cheap-eval-source-map' : 'source-map'

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry: [
      'webpack-hot-middleware/client?name=client&reload=true',
      '@ninetails-monorepo-react-ssr/app/client.js'
    ],
    output: {
      path: `${dist}/client`,
      filename: 'index.js'
    },
    mode,
    devtool,
    node: {
      process: false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: includePaths,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { useBuiltIns: 'entry', targets: '> 10%' }],
                ...restPresets
              ],
              plugins
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new StatsWriterPlugin({
        filename: 'stats.json'
      })
    ]
  },
  {
    name: 'server',
    target: 'node',
    entry: [
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
          test: /\.js$/,
          include: includePaths,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { useBuiltIns: 'entry', targets: { node: 'current' } }],
                ...restPresets
              ],
              plugins
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
]
