import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import getRoot from './helpers/getRoot'

const root = getRoot(process.env.REACT_APP_ROOT)

ReactDOM.createRoot(root, { hydrate: root.hasChildNodes() }).render(<App />)
