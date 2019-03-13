import React from 'react'
// import { hydrate, render } from 'react-dom'
import { unstable_createRoot } from 'react-dom' // eslint-disable-line camelcase
import App from './app'
import getRoot from './helpers/getRoot'

const app = (
  <App />
)

function init (root = getRoot(process.env.REACT_APP_ROOT)) {
  return unstable_createRoot(root, { hydrate: root.hasChildNodes() }).render(app)
}

init()
