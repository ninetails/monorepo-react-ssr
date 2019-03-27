const pino = require('pino')

const ifDev = (left, right) =>
  process.env.NODE_ENV === 'development' ? left : right

module.exports = pino({
  level: ifDev('trace', 'info')
})
