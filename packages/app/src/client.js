import React from 'react'
import { unstable_createRoot } from 'react-dom' // eslint-disable-line camelcase
import App from './app'
import BrowserRouter from './helpers/BrowserRouter'
import getRoot from './helpers/getRoot'
import { register as registerServiceWorker } from './serviceWorker'

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

function init (root = getRoot(process.env.REACT_APP_ROOT)) {
  return unstable_createRoot(root, { hydrate: root.hasChildNodes() }).render(app)
}

init()

registerServiceWorker()
