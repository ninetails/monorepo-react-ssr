const { existsSync, readFileSync } = require('fs')
const { join } = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const definePluginFactory = require('./helpers/definePluginFactory')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

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

const manifest = existsSync(join(process.cwd(), 'manifest.js')) ? require(join(process.cwd(), 'manifest.js')) : undefined

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry:
      ifDev(['webpack-hot-middleware/client?name=client&reload=true', 'react-hot-loader/patch'], [])
        .concat([
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
          include: join(process.cwd(), 'src'),
          use: {
            loader: 'babel-loader',
            options: babelConfig
          }
        }
      ]
    },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    },
    optimization: {
      minimizer:
        ifProd(
          [
            new TerserPlugin({
              cache: false,
              parallel: true,
              sourceMap: true,
              extractComments: 'all',
              terserOptions: {
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
          react: {
            test: /node_modules\/([^/]+\/)?react(-helmet)?(-router)?(-dom)?\//,
            chunks: 'initial',
            name: 'react',
            enforce: true,
            priority: 3
          },
          corejs: {
            test: /node_modules\/core-js/,
            chunks: 'initial',
            name: 'corejs',
            enforce: true,
            priority: 2
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendors',
            enforce: true,
            priority: 1
          }
        }
      }
    },
    plugins: [
      ifDev(new webpack.HotModuleReplacementPlugin({ multiStep: true }), () => undefined),
      definePluginFactory(customEnvVars),
      !manifest
        ? () => undefined
        : new WebpackPwaManifest({
          inject: false,
          filename: 'manifest.json',
          ...manifest
        }),
      new StatsWriterPlugin({
        filename: 'stats.json'
      }),
      new InjectManifest({
        swSrc: join(process.cwd(), 'src', 'sw.js'),
        exclude: [/\.map$/]
      }),
      process.env.WEBPACK_BUNDLE_ANALYZE ? new BundleAnalyzerPlugin() : () => undefined
    ]
  },
  {
    name: 'server',
    target: 'node',
    entry:
      ifDev(['webpack-hot-middleware/client?name=server', 'react-hot-loader/patch'], [])
        .concat([
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
          include: join(process.cwd(), 'src'),
          use: {
            loader: 'babel-loader',
            options: babelConfig
          }
        }
      ]
    },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    },
    plugins: [
      ifDev(new webpack.HotModuleReplacementPlugin(), () => undefined),
      definePluginFactory(customEnvVars)
    ]
  }
]
