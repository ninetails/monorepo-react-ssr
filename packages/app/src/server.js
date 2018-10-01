import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export default function serverRenderer ({ clientStats, serverStats }) {
  return (req, res, next) => {
    res.status(200).send(`
      <!doctype html>
      <html>
      <head>
        <title>App</title>
      </head>
      <body>
        <div id="root">
          ${renderToString(<App />)}
        </div>
        <script src="/client.js"></script>
      </body>
      </html>
    `)
  }
}
