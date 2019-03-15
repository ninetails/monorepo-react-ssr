import React from 'react'
import { renderToStaticNodeStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import renderContent from './helpers/renderContent'
import createRenderChunk from './helpers/createRenderChunk'
import App from './app'

// eslint-disable-next-line react/prop-types
function createApp ({ location, context }) {
  return (
    <StaticRouter location={location} context={context}>
      <App />
    </StaticRouter>
  )
}

function expressRenderHtmlShell ({
  content = '',
  head,
  res,
  renderChunks,
  root = process.env.REACT_APP_ROOT || 'root'
}) {
  res.write('<!doctype html>')

  return renderToStaticNodeStream(
    <html>
      <head>
        {head}
        {renderChunks((chunk, key) => <link key={key} rel='preload' as='script' href={chunk} />)}
      </head>
      <body>
        <div
          id={process.env.REACT_APP_ROOT || 'root'}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {renderChunks((chunk, key) => <script key={key} src={chunk} async />)}
      </body>
    </html>
  )
    .pipe(res, { end: 'false' })
}

async function render ({ req, res, renderChunks }) {
  const head = <title>React App</title>

  try {
    const context = {}

    const content = await renderContent(createApp({
      context,
      location: req.url
    }))

    if (context.url) {
      return res.redirect(301)
    }

    return expressRenderHtmlShell({
      content,
      head,
      res: res.status(200),
      renderChunks
    })
  } catch (err) {
    console.error(err)

    return expressRenderHtmlShell({
      head,
      res: res.status(500),
      renderChunks
    })
  }
}

function serverRenderer ({ clientStats, serverStats }) {
  const renderChunks = createRenderChunk(clientStats)

  return (req, res) => {
    return render({ req, res, renderChunks })
  }
}

export default serverRenderer
