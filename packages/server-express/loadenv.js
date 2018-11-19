const { existsSync } = require('fs')
const dotenv = require('dotenv')

const envFilesList = ['.env.local', '.env']
const dirList = [__dirname, process.cwd()]

envFilesList
  .reduce((acc, envFile) => acc.concat(dirList.map(dir => `${dir}/${envFile}`)), [])
  .filter((path, index, arr) => arr.indexOf(path) === index)
  .filter(existsSync)
  .forEach(path => dotenv.config({ path }))
