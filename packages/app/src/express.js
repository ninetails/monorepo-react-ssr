import React from 'react'
import { renderToStaticNodeStream, renderToString } from 'react-dom/server'
import App from './app'

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

const createRenderChunk = ({ assetsByChunkName }) => fn => {
  function renderChunk (chunk, key = '') {
    if (!chunk) {
      return null
    }

    if (typeof chunk === 'string') {
      return fn(chunk, key)
    }

    if (Array.isArray(chunk)) {
      return chunk.map((curr, i) => renderChunk(curr, `${key}-${i}`))
    }

    return Object.keys(chunk).map(chunkName => renderChunk(chunk[chunkName], chunkName))
  }

  return renderChunk(assetsByChunkName)
}

function serverRenderer ({ clientStats, serverStats }) {
  const renderChunks = createRenderChunk(clientStats)
  return async (req, res, next) => {
    try {
      const content = await renderContent()

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
