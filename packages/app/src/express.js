import React from 'react'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import { HeadProvider } from 'react-head'
import { StaticRouter } from 'react-router-dom'
import App from './App'

export default function serverRenderer ({ clientStats, serverStats }) {
  const { main } = clientStats.assetsByChunkName
  const mainSrc = typeof main === 'string' ? main : main[0]

  return (req, res, next) => {
    const headTags = []
    const context = {}
    const content = renderToString(
      <HeadProvider headTags={headTags}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </HeadProvider>
    )

    if (context.url) {
      return res.redirect(301, context.url)
    }

    res.status(200)
    res.write('<!doctype html>')
    renderToNodeStream(
      <html>
        <head
          dangerouslySetInnerHTML={{
            __html: renderToString(headTags)
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
    ).pipe(res)
  }
}
