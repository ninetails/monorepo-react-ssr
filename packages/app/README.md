# @ninetails-monorepo-react-ssr/app

> React App package

Contains all application, made in React. Please use following files for entrypoints on webpack:

- **client**: `@ninetails-monorepo-react-ssr/app/client.js`
- **express server**: `@ninetails-monorepo-react-ssr/app/express.js`

## @ninetails-monorepo-react-ssr/app-dev

### Scripts

- **build**
  Will generate `@ninetails-monorepo-react-ssr/app` on `dist` directory. That package will be used as dependency for `server-express` package.
- **coverage**
  Runs jest with coverage. It will output current coverage for `src` folder and generate files on `coverage` directory.
- **lint**
  Runs `eslint` over `src`.
- **test**
  Runs `jest`.
- **watch**
  Will build and watch for changes inside `src`.
