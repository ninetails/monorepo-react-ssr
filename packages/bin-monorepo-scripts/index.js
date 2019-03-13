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
const { _unknown: mainArgv = [], help, command } = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })

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

function run (main, args = []) {
  switch (main) {
    case 'lint':
      const eslintArgv = [...args]
      if (!existsSync(join(process.cwd(), '.eslintrc'))) {
        eslintArgv.push('-c', join(__dirname, '.eslintrc'))
      }

      return spawn('eslint', eslintArgv, { detached: true, stdio: 'inherit' })
    case 'babel':
      const babelArgv = [...args]

      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development'
      }
      console.log(`NODE_ENV=${process.env.NODE_ENV}`)

      ;['test', 'spec', 'stories'].forEach(partial => babelArgv.push('--ignore', `**/*.${partial}.js`))

      if (process.env.BABELRC) {
        babelArgv.push('--config-file', process.env.BABELRC)
      } else if (!existsSync(join(process.cwd(), '.babelrc'))) {
        babelArgv.push('--config-file', join(__dirname, '.babelrc'))
      }

      switch (process.env.NODE_ENV) {
        case 'development':
          babelArgv.push('--source-maps', 'inline')
          break
        case 'production':
          babelArgv.push('-s')
          break
        default:
      }

      return spawn('babel', babelArgv, { detached: true, stdio: 'inherit' })
    case 'test':
      process.env.BABEL_ENV = 'test'
      process.env.NODE_ENV = 'test'
      process.env.PUBLIC_URL = ''
      require('./loadenv')

      const jestArgv = [...args]

      if (process.env.CI) {
        jestArgv.push('--silent')
      }

      if (
        !process.env.CI &&
        jestArgv.indexOf('--coverage') === -1
      ) {
        jestArgv.push('--watch')
      }

      jestArgv.push('-c', join(__dirname, 'jest.config.js'))
      jestArgv.push('--rootDir', process.cwd())
      jestArgv.push('--setupFilesAfterEnv', join(__dirname, 'jest.setup.js'))
      // jestArgv.push('--showConfig')

      return jest.run(jestArgv)
    default:
      console.error(`Command not found: ${command}`)
      process.exit(1)
  }
}

run(command, mainArgv)
