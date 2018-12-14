import React from 'react'
import { renderToStaticNodeStream, renderToString } from 'react-dom/server'
import {
  HeadProvider,
  createRegistry
} from '@ninetails-monorepo-react-ssr/react-kabocha'
import { StaticRouter as Router } from 'react-router-dom'
import App from './App'

async function renderContent (props) {
  try {
    return renderToString(
      <HeadProvider registry={props.registry}>
        <Router location={props.location} context={props.context}>
          <App />
        </Router>
      </HeadProvider>
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
    const registry = createRegistry()
    const context = {}

    try {
      const content = await renderContent({
        context,
        location: req.url,
        registry
      })

      if (context.url) {
        return res.redirect(301, context.url)
      }

      res.status(200).write('<!doctype html>')
      renderToStaticNodeStream(
        <html>
          <head>{registry.head()}</head>
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
