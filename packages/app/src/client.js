import React from 'react'
// import { hydrate, render } from 'react-dom'
import { unstable_createRoot } from 'react-dom' // eslint-disable-line camelcase
import App from './app'

function getRoot (
  id = 'root',
  { tag = 'div', document = global.document } = {}
) {
  let root = document.getElementById(id)

  if (!root) {
    root = document.createElement(tag)
    root.id = id
    document.body.appendChild(root)
  }

  return root
}

function init (root = getRoot(process.env.REACT_APP_ROOT)) {
  // createRoot(root, { hydrate: root.hasChildNodes() }).render(...)
  unstable_createRoot(root, { hydrate: root.hasChildNodes() }).render(<App />)

  // const renderFn = root.hasChildNodes() ? hydrate : render
  // renderFn(<App />, root)
}

init()
