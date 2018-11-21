import React from 'react'
import ReactDOM from 'react-dom'
import { HeadProvider } from 'react-head'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import getRoot from './helpers/getRoot'

const root = getRoot(process.env.REACT_APP_ROOT)

ReactDOM.createRoot(root, { hydrate: root.hasChildNodes() }).render(
  <HeadProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HeadProvider>
)
