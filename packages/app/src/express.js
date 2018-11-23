import React from 'react'
import { renderToStaticNodeStream, renderToString } from 'react-dom/server'
import { HeadProvider } from 'react-head'
import { StaticRouter as Router } from 'react-router-dom'
import App from './App'

function serverRenderer ({ clientStats, serverStats }) {
  const { main } = clientStats.assetsByChunkName
  const mainSrc = typeof main === 'string' ? main : main[0]

  return async (req, res, next) => {
    const head = []
    const context = {}

    try {
      const content = renderToString(
        <HeadProvider headTags={head}>
          <Router location={req.url} context={context}>
            <App />
          </Router>
        </HeadProvider>
      )

      if (context.url) {
        return res.redirect(301, context.url)
      }

      res.status(200).write('<!doctype html>')
      renderToStaticNodeStream(
        <html>
          <head>{head}</head>
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
