import React from 'react'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import App from './App'

export default function serverRenderer ({ clientStats, serverStats }) {
  const { main } = clientStats.assetsByChunkName
  const mainSrc = typeof main === 'string' ? main : main[0]

  return (req, res, next) => {
    const content = renderToString(<App />)
    const helmet = Helmet.renderStatic()

    const htmlAttrs = helmet.htmlAttributes.toComponent()
    const bodyAttrs = helmet.bodyAttributes.toComponent()

    const html = renderToString(
      <html {...htmlAttrs}>
        <head>
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
        </head>
        <body {...bodyAttrs}>
          <div id={process.env.REACT_APP_ROOT || 'root'} dangerouslySetInnerHTML={{ __html: content }} />
          <script src={`/${mainSrc}`} />
        </body>
      </html>
    )

    res.status(200).send(['<!doctype html>', html].join(''))
  }
}
