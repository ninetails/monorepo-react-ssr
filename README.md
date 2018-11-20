# Monorepo React SSR

> Simple monorepo with a server running with React with SSR

## Usage

After clone this repo, run

```sh
$ yarn reset
```

For App development, open one terminal and do:

```sh
$ cd packages/app
$ yarn watch
```

and on another terminal:

```sh
$ cd packages/server-express
$ yarn dev
```

## Production Usage

**@TODO** It will works only after publishing all packages

But the idea is:

```sh
$ cd packages/server-express
$ yarn
$ yarn build
$ yarn start
```

## Scripts

- **lint**
  Finds on every changed package since `develop` for a script named `lint` and runs it in parallel. Bail on first error found.
- **reset**
  Clean and installs all dependencies on each package.
- **test**
  Finds on every changed package since `develop` for a script named `test` and runs it in parallel. Bail on first error found.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information about the stack used on this repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
