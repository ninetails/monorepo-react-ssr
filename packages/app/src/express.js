import React from 'react'
import { renderToStaticNodeStream, renderToString } from 'react-dom/server'
import App from './App'

async function renderContent (props = {}) {
  try {
    return renderToString(
      <App />
    )
  } catch (err) {
    if (err instanceof Promise) {
      await err

      return renderContent(props)
    }

    throw err
  }
}

function serverRenderer ({ clientStats, serverStats }) {
  const { main } = clientStats.assetsByChunkName
  const mainSrc = typeof main === 'string' ? main : main[0]

  return async (req, res, next) => {
    try {
      const content = await renderContent()

      res.status(200).write('<!doctype html>')
      renderToStaticNodeStream(
        <html>
          <head>
            <title>React App</title>
          </head>
          <body>
            <div
              id={process.env.REACT_APP_ROOT || 'root'}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <script src={`/${mainSrc}`} />
          </body>
        </html>
      ).pipe(
        res,
        { end: 'false' }
      )
    } catch (err) {
      // @todo error page
      console.error(err)
      res.status(500).send('Server error')
    }
  }
}

export default serverRenderer
