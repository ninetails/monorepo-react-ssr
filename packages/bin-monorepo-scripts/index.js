#!/usr/bin/env node
const { join } = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const jest = require('jest')

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
  }
]
const { _unknown, help, command } = commandLineArgs(mainDefinitions, { partial: true })

if (help) {
  const sections = [
    {
      header: 'Usage',
      content: '{italic monorepo-scripts {underline command}}' // prettier-ignore
    },
    {
      header: 'Available commands',
      content: '{underline build}, {underline lint}, {underline test}'
    }
  ]
  const usage = commandLineUsage(sections)
  console.log(usage)
  process.exit(0)
}

require('./loadenv')

switch (command) {
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
    // argv.push('--showConfig')

    jest.run(argv)
    break
  default:
    console.error(`Command not found: ${command}`)
    process.exit(1)
}
