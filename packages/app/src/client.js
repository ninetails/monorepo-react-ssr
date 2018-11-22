import React from 'react'
import ReactDOM from 'react-dom'
import { HeadProvider } from 'react-head'
import { BrowserRouter as Router } from 'react-router-dom'
import getRoot from './client/getRoot'
import App from './App'

const root = getRoot(process.env.REACT_APP_ROOT)

ReactDOM.createRoot(root, { hydrate: root.hasChildNodes() }).render(
  <HeadProvider>
    <Router>
      <App />
    </Router>
  </HeadProvider>
)
