import React from 'react'
import ReactDOM from 'react-dom'
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
  // ReactDOM.createRoot(root, { hydrate: root.hasChildNodes() }).render(...)
  const renderFn = root.hasChildNodes() ? ReactDOM.hydrate : ReactDOM.render
  renderFn(<App />, root)
}

init()
