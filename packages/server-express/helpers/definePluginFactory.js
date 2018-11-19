const webpack = require('webpack')

function filterByPrefixReactApp (obj, prefix = 'REACT_APP_') {
  return Object.keys(obj)
    .filter(key => key.indexOf(prefix) === 0)
    .reduce((acc, key) => ({ ...acc, [key]: JSON.stringify(obj[key]) }), {})
}

function filterObj (obj = {}, attrs = []) {
  return attrs.reduce(
    (acc, name) => ({
      ...acc,
      [name]: obj[name] ? JSON.stringify(obj[name]) : null
    }),
    {}
  )
}

module.exports = function definePluginFactory (vars = [], { processEnv = process.env, DefinePlugin = webpack.DefinePlugin } = {}) {
  return new DefinePlugin({
    'process.env': Object.assign({}, filterByPrefixReactApp(processEnv), filterObj(processEnv, vars))
  })
}
