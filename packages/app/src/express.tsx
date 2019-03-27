import * as React from 'react'
import { renderToStaticNodeStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Request, Response } from 'express'
import renderContent from './helpers/renderContent'
import createRenderChunk, { RenderElementFn, RenderChunk } from './helpers/createRenderChunk'
import App from './app'

type CreateAppArgs = {
  location: string;
  context: any;
}

function createApp({ location, context }: CreateAppArgs) {
  return (
    <StaticRouter location={location} context={context}>
      <App />
    </StaticRouter>
  )
}

type ExpressRenderHtmlShellArgs = {
  content?: string;
  head: string | JSX.Element;
  res: Response;
  root?: string;
  renderChunks: RenderChunk;
}

function expressRenderHtmlShell({
  content = '',
  head,
  res,
  renderChunks,
  root = process.env.REACT_APP_ROOT || 'root'
}: ExpressRenderHtmlShellArgs) {
  res.setHeader('Content-Type', 'text/html')
  res.write('<!doctype html>')

  return renderToStaticNodeStream(
    <html>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {head}
        {renderChunks((chunk: string, key: string) => (
          <link key={key} rel="preload" as="script" href={chunk} />
        ))}
      </head>
      <body>
        <div id={root} dangerouslySetInnerHTML={{ __html: content }} />
        {renderChunks((chunk: string, key: string) => (
          <script key={key} src={chunk} async />
        ))}
      </body>
    </html>
  ).pipe(
    res,
    { end: false }
  )
}

type RenderArgs = {
  req: Request;
  res: Response;
  renderChunks: RenderChunk;
}

type ReactRouterCustomContext = {
  url?: string;
  statusCode?: number;
}

async function render({ req, res, renderChunks }: RenderArgs) {
  const head = <title>React App</title>

  try {
    const context: ReactRouterCustomContext = {}

    const content = await renderContent(
      createApp({
        context,
        location: req.url
      })
    )

    if (context.url) {
      return res.redirect(301, context.url)
    }

    return expressRenderHtmlShell({
      content,
      head,
      res: res.status(context.statusCode || 200),
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

type ServerRendererArgs = {
  clientStats?: object;
  serverStats?: object;
}

type ServerRenderer = (req: Request, res: Response) => void

function serverRenderer({ clientStats }: ServerRendererArgs): ServerRenderer {
  const renderChunks = createRenderChunk(clientStats) as RenderChunk

  return (req, res) => {
    return render({ req, res, renderChunks })
  }
}

export default serverRenderer
