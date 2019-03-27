#!/usr/bin/env node
const { existsSync } = require('fs')
const { join } = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const jest = require('jest')
const { spawn } = require('child_process')

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
const { _unknown: mainArgv = [], help, command } = commandLineArgs(
  mainDefinitions,
  { stopAtFirstUnknown: true }
)

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
  // eslint-disable-next-line no-console
  console.log(usage)
  process.exit(0)
}

function run(main, args = []) {
  const argv = [...args]
  switch (main) {
    case 'lint':
      if (!existsSync(join(process.cwd(), '.eslintrc'))) {
        argv.push('-c', join(__dirname, '.eslintrc'))
      }

      return spawn('eslint', argv, { detached: true, stdio: 'inherit' })
    case 'tsc':
      return spawn(join(__dirname, 'node_modules', '.bin', 'tsc'), argv, {
        detached: true,
        stdio: 'inherit'
      })
    case 'babel':
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development'
      }
      // eslint-disable-next-line no-console
      console.log(`NODE_ENV=${process.env.NODE_ENV}`)
      ;['test', 'spec', 'stories'].forEach(partial =>
        argv.push('--ignore', `**/*.${partial}.js`)
      )

      if (process.env.BABELRC) {
        argv.push('--config-file', process.env.BABELRC)
      } else if (!existsSync(join(process.cwd(), '.babelrc'))) {
        argv.push('--config-file', join(__dirname, '.babelrc'))
      }

      switch (process.env.NODE_ENV) {
        case 'development':
          argv.push('--source-maps', 'inline')
          break
        case 'production':
          argv.push('-s')
          break
        default:
      }

      return spawn('babel', argv, { detached: true, stdio: 'inherit' })
    case 'test':
      process.env.BABEL_ENV = 'test'
      process.env.NODE_ENV = 'test'
      process.env.PUBLIC_URL = ''
      require('./loadenv')

      if (process.env.CI) {
        argv.push('--silent')
      }

      if (!process.env.CI && argv.indexOf('--coverage') === -1) {
        argv.push('--watch')
      }

      argv.push('-c', join(__dirname, 'jest.config.js'))
      argv.push('--rootDir', process.cwd())
      argv.push('--setupFilesAfterEnv', join(__dirname, 'jest.setup.js'))
      // argv.push('--showConfig')

      return jest.run(argv)
    default:
      // eslint-disable-next-line no-console
      console.error(`Command not found: ${command}`)
      process.exit(1)
  }
}

run(command, mainArgv)
