import React from 'react'
// import { hydrate, render } from 'react-dom'
import { unstable_createRoot } from 'react-dom/server' // eslint-disable-line camelcase
import App from './app'
import getRoot from './helpers/getRoot'

const app = (
  <App />
)

function init (root = getRoot(process.env.REACT_APP_ROOT)) {
  // createRoot(root, { hydrate: root.hasChildNodes() }).render(...)
  unstable_createRoot(root, { hydrate: root.hasChildNodes() }).render(app)

  // const renderFn = root.hasChildNodes() ? hydrate : render
  // renderFn(app, root)
}

init()
