#!/usr/bin/env node
const { promisify } = require('util')
const { join } = require('path')
const { readFile, writeFile } = require('fs')
const commandLineArgs = require('command-line-args')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const optionDefinitions = [
  { name: 'peer', alias: 'p', type: String, multiple: true }
]
const { peer } = commandLineArgs(optionDefinitions)

const BASE_PATH = process.cwd()
const PACKAGE_FILE = 'package.json'
const TARGET_PATH = 'dist'

const resolveDependencies = dependencies =>
  Object.keys(dependencies).reduce((acc, name) => {
    if (name === 'prop-types') {
      return acc
    }

    const type = peer.includes(name)
      ? 'peerDependencies'
      : 'dependencies'
    return {
      ...acc,
      [type]: {
        ...(acc[type] || {}),
        [name]: dependencies[name]
      }
    }
  }, {})

function updateJson ({
  name,
  version,
  dependencies,
  devDependencies,
  private: pkgPrivate,
  scripts,
  husky,
  ...rest
}) {
  if (!/-dev$/.test(name)) {
    throw new Error('Package name must end with "-dev"')
  }

  return {
    name: name.replace(/-dev$/, ''),
    version,
    ...rest,
    ...resolveDependencies(dependencies)
  }
}

readFileAsync(join(BASE_PATH, PACKAGE_FILE), { encoding: 'utf8' })
  .then(function parse (str) {
    return JSON.parse(str)
  })
  .then(updateJson)
  .then(function stringify (obj) {
    return JSON.stringify(obj, null, 2)
  })
  .then(function savePackage (data) {
    return writeFileAsync(
      join(BASE_PATH, TARGET_PATH, PACKAGE_FILE),
      `${data}\n`
    )
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
