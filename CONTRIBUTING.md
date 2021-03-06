# Contributing

## Repo coding standards

It uses [JavaScript Standard Style](https://standardjs.com/) with [eslint](https://eslint.org/) and some hooks to ensure code quality, including running tests using [Jest](https://jestjs.io/). This repo aims for `react@^16.7.0` (currently on `react@^16.7.0-alpha.2`) with frontend code written in ES6 transpiled with [Babel](https://babeljs.io/).

For Node.js version, it is set to `lts/*` (currently on `lts/dubnium`) managed with [nvm](https://github.com/creationix/nvm).

For folder structure, it is based on monorepo using [Lerna](https://lernajs.io/) and uses [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) (so it's recommended to use [Yarn](https://yarnpkg.com/) as default package manager).

For commit standard, it uses [commitlint](https://marionebl.github.io/commitlint/) following [Conventional Commits](https://www.conventionalcommits.org/).

There's some git hooks as mentioned before. It was managed using [Husky](https://github.com/typicode/husky). Please avoid running commands with `--no-verify`.

Also there's an [.editorconfig](https://editorconfig.org/) file to ensure compatibility with most used editors.

It's also recommended to use `prettier-eslint` for autoformatting files on save, depending on your editor.

## Package folder naming

**app** package is currently containing core app for this repo.

For **config**, it holds some configuration for tooling like Babel, eslint and Webpack.

Folders starting with **bin-** contains binary scripts that will be used as internal tools over this monorepo.

For corresponding folder and package name, please run **npx lerna ls -al**.

### Hooks

- **commit-msg**: runs commitlint
  Ensure that commit message is using Conventional Commits format
- **pre-commit**: runs linter
  Finds on every changed package since `develop` for a script named `lint` and runs it in parallel. Bail on first error found.
- **pre-push**: runs test
  Finds on every changed package since `develop` for a script named `test` and runs it in parallel. Bail on first error found.
