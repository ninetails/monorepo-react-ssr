#!/usr/bin/env node
const { join } = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const jest = require('jest')
const webpack = require('webpack')

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
  }
]
const { _unknown, help, command, verbose } = commandLineArgs(mainDefinitions, { partial: true })

if (help) {
  const sections = [
    {
      header: 'Usage',
      content: '{italic ssr-scripts {underline command}}' // prettier-ignore
    },
    {
      header: 'Available commands',
      content: '{underline dev}, {underline start}, {underline build}'
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

require('./loadenv')

switch (command) {
  case 'dev':
    process.env.NODE_ENV = 'development'
    require('./server')(getStats(verbose))
    break
  case 'start':
    process.env.NODE_ENV = 'production'
    require('./server')(getStats(verbose))
    break
  case 'build':
    process.env.NODE_ENV = 'production'
    const webpackConfig = require('./webpack.config')
    webpack(webpackConfig, (err, stats) => {
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

      console.log(stats.toString({
        chunks: false,
        colors: true
      }))
    })
    break
  case 'test':
    process.env.BABEL_ENV = 'test'
    process.env.NODE_ENV = 'test'
    process.env.PUBLIC_URL = ''

    const argv = [...(_unknown || [])]
    if (process.env.CI) {
      argv.push('--silent')
    }
    if (
      !process.env.CI &&
      argv.indexOf('--coverage') === -1
    ) {
      argv.push('--watch')
    }
    argv.push('-c', join(__dirname, 'jest.config.js'))
    argv.push('--rootDir', process.cwd())
    argv.push('--setupFilesAfterEnv', join(__dirname, 'jest.setup.js'))
    jest.run(argv)
    break
  default:
    console.error(`Command not found: ${command}`)
    process.exit(1)
}
