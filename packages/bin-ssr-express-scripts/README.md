# @ninetails-monorepo-react-ssr/ssr-express-scripts

It runs a server with [express](https://expressjs.com/) using [SPDY](https://www.npmjs.com/package/spdy) for HTTP/2 and webpack with hot-reload on development and rendering frontend with SSR.

It uses entrypoints from `@ninetails-monorepo-react-ssr/app` package.

## Scripts

- **build**: Generates files for use
- **dev**: Runs an **express server** using `hot reload`.
- **start**: Runs server in production mode. Requires built files.
