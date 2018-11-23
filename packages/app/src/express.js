import React from 'react'
import { renderToStaticNodeStream, renderToString, renderToStaticMarkup } from 'react-dom/server'
import { HeadProvider } from 'react-head'
import { StaticRouter as Router } from 'react-router-dom'
import createPrependStringStream from './server/createPrependStringStream'
import App from './App'

function serverRenderer ({ clientStats, serverStats }) {
  const { main } = clientStats.assetsByChunkName
  const mainSrc = typeof main === 'string' ? main : main[0]

  return async (req, res, next) => {
    const headTags = []
    const context = {}

    try {
      const content = renderToString(
        <HeadProvider headTags={headTags}>
          <Router location={req.url} context={context}>
            <App />
          </Router>
        </HeadProvider>
      )

      if (context.url) {
        return res.redirect(301, context.url)
      }

      const head = renderToStaticMarkup(headTags)

      renderToStaticNodeStream(
        <html>
          <head
            dangerouslySetInnerHTML={{
              __html: head
            }}
          />
          <body>
            <div
              id={process.env.REACT_APP_ROOT || 'root'}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <script src={`/${mainSrc}`} />
          </body>
        </html>
      )
        .pipe(createPrependStringStream('<!doctype html>'), { end: 'false' })
        .pipe(res.status(200), { end: 'false' })
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  }
}

export default serverRenderer
