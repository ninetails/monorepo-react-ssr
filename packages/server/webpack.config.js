const { dirname } = require('path')
const babelConfig = require('config-babel')
const { presets, plugins } = babelConfig
const [ presetEnv, ...restPresets ] = presets // eslint-disable-line no-unused-vars

const includePaths = [
  dirname(require.resolve('app/package.json'))
]

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry: 'app/client.js',
    mode: process.env.NODE_ENV || 'development',
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
    }
  },
  {
    name: 'server',
    target: 'node',
    entry: 'app/server.js',
    mode: process.env.NODE_ENV || 'development',
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
    }
  }
]
