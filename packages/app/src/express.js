import React from 'react'
import { renderToNodeStream, renderToStaticNodeStream } from 'react-dom/server'
import { HeadProvider } from 'react-head'
import { StaticRouter as Router } from 'react-router-dom'
import promisifyNodeStream from './server/promisifyNodeStream'
import createPrependStringStream from './server/createPrependStringStream'
import App from './App'

function serverRenderer ({ clientStats, serverStats }) {
  const { main } = clientStats.assetsByChunkName
  const mainSrc = typeof main === 'string' ? main : main[0]

  return async (req, res, next) => {
    const headTags = []
    const context = {}

    const contentStream = renderToNodeStream(
      <HeadProvider headTags={headTags}>
        <Router location={req.url} context={context}>
          <App />
        </Router>
      </HeadProvider>
    )

    const contentBuffer = await promisifyNodeStream(contentStream)

    if (context.url) {
      return res.redirect(301, context.url)
    }

    const headBuffer = await promisifyNodeStream(
      renderToStaticNodeStream(headTags)
    )

    renderToStaticNodeStream(
      <html>
        <head
          dangerouslySetInnerHTML={{
            __html: headBuffer.toString()
          }}
        />
        <body>
          <div
            id={process.env.REACT_APP_ROOT || 'root'}
            dangerouslySetInnerHTML={{ __html: contentBuffer.toString() }}
          />
          <script src={`/${mainSrc}`} />
        </body>
      </html>
    )
      .pipe(createPrependStringStream('<!doctype html>'))
      .pipe(res.status(200))
  }
}

export default serverRenderer
