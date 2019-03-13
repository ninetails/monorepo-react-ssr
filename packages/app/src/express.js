import React from 'react'
import { renderToStaticNodeStream } from 'react-dom/server'
import renderContent from './helpers/renderContent'
import createRenderChunk from './helpers/createRenderChunk'
import App from './app'

const app = (
  <App />
)

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

function serverRenderer ({ clientStats, serverStats }) {
  const renderChunks = createRenderChunk(clientStats)
  const head = <title>React App</title>

  return async (req, res, next) => {
    try {
      const content = await renderContent(app)

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
}

export default serverRenderer
