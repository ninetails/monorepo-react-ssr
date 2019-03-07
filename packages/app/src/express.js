import React from 'react'
import { renderToStaticNodeStream } from 'react-dom/server'
import renderContent from './helpers/renderContent'
import createRenderChunk from './helpers/createRenderChunk'
import App from './app'

const app = (
  <App />
)

function serverRenderer ({ clientStats, serverStats }) {
  const renderChunks = createRenderChunk(clientStats)
  return async (req, res, next) => {
    try {
      const content = await renderContent(app)

      res.status(200).write('<!doctype html>')
      renderToStaticNodeStream(
        <html>
          <head>
            {renderChunks((chunk, key) => <link key={key} rel='preload' as='script' href={chunk} />)}
            <title>React App</title>
          </head>
          <body>
            <div
              id={process.env.REACT_APP_ROOT || 'root'}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {renderChunks((chunk, key) => <script key={key} src={chunk} async />)}
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
