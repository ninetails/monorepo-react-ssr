#!/usr/bin/env node
const { existsSync } = require('fs')
const { join } = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const rimraf = require('rimraf')
const webpack = require('webpack')

const configPath = process.env.WEBPACK_CONFIG || join(process.cwd(), 'webpack.config.js')

const mainDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'displays this help'
  },
  {
    name: 'command',
    defaultOption: true
  },
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean
  },
  {
    name: 'clean',
    alias: 'c',
    type: Boolean,
    description: 'performs a clean start, rebuilding application'
  },
  {
    name: 'dev',
    type: Boolean,
    description: 'load .env file (for start command)'
  }
]
const { help, clean, command, dev, verbose } = commandLineArgs(mainDefinitions, { partial: true })

if (help) {
  const sections = [
    {
      header: 'Usage',
      content: '{italic ssr-scripts {underline command}}' // prettier-ignore
    },
    {
      header: 'Available commands',
      content: '{underline analyze}, {underline build}, {underline start}, {underline watch}'
    }
  ]
  const usage = commandLineUsage(sections)
  console.log(usage)
  process.exit(0)
}

function getStats (verbose) {
  if (verbose) {
    return {
      colors: true
    }
  }

  return {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: false,
    errorDetails: false,
    warnings: false,
    publicPath: false
  }
}

function transpile (cb = () => undefined, showAllStats = false) {
  webpack(require(configPath), (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      process.exit(2)
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      info.errors.forEach(error => console.error(error))
      process.exit(2)
    }

    if (stats.hasWarnings()) {
      info.warnings.forEach(warn => console.warn(warn))
    }

    console.log(stats.toString(getStats(showAllStats)))

    cb()
  })
}

function runServer (showAllStats = false) {
  require('./server')({ config: require(configPath), stats: getStats(showAllStats) })
}

function run ({ clean, dev: loadEnvs, verbose: showAllStats }) {
  switch (command) {
    case 'watch':
      process.env.NODE_ENV = 'development'

      require('./loadenv')
      runServer(showAllStats)
      break
    case 'start':
      process.env.NODE_ENV = 'production'

      if (loadEnvs) {
        require('./loadenv')
      }

      if (clean) {
        rimraf(join(process.cwd(), 'dist'), () => transpile(() => runServer(showAllStats), showAllStats))
      } else if (!existsSync(join(process.cwd(), 'dist', 'server.js'))) {
        transpile(() => runServer(showAllStats), showAllStats)
      } else {
        runServer(showAllStats)
      }

      break
    case 'analyze':
      process.env.WEBPACK_BUNDLE_ANALYZE = true
    // eslint-disable-next-line no-fallthrough
    case 'build':
      process.env.NODE_ENV = 'production'
      transpile(() => undefined, showAllStats)

      break
    default:
      console.error(`Command not found: ${command}`)
      process.exit(1)
  }
}

run({ clean, dev, verbose })
