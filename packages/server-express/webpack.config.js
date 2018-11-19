const { join } = require('path')
const webpack = require('webpack')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const definePluginFactory = require('./helpers/definePluginFactory')

require('./loadenv')

const dist = join(__dirname, 'dist')

const mode = process.env.NODE_ENV || 'development'
const devtool = process.env.NODE_ENV === 'development' ? 'cheap-eval-source-map' : 'source-map'

const customEnvVars = []

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
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new StatsWriterPlugin({
        filename: 'stats.json'
      }),
      definePluginFactory(customEnvVars)
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
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      definePluginFactory(customEnvVars)
    ]
  }
]
