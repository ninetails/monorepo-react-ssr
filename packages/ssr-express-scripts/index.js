#!/usr/bin/env node
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

const mainDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'displays this halp'
  },
  {
    name: 'command',
    defaultOption: true
  }
]
const { help, command } = commandLineArgs(mainDefinitions)

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

switch (command) {
  case 'dev':
    process.env.NODE_ENV = 'development'
    require('./server')
    break
  case 'start':
    process.env.NODE_ENV = 'production'
    require('./server')
    break
  case 'build':
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
  default:
    console.error(`Command not found: ${command}`)
    process.exit(1)
}
