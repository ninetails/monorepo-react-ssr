# @ninetails-monorepo-react-ssr/babel-preset-monorepo-react-ssr

This package contains Babel configuration used for most packages on this monorepo.

You can simply use as creating a file named `.babelrc` and putting:

```js
{
  "presets": ["@ninetails-monorepo-react-ssr/monorepo-react-ssr"]
}
```

And don't forget to add `"@ninetails-monorepo-react-ssr/babel-preset-monorepo-react-ssr": "*"` to `package.json`.

It also re-exports `babel` command for `npm script` usage.

## For repos using Jest

It will need to "reset" `@babel/preset-env` for **test** environment. So make these changes on your `.babelrc`:

```js
{
  "presets": ["@ninetails-monorepo-react-ssr/monorepo-react-ssr"],
  "env": {
    "test": {
      "presets": ["@babel/preset-env"]
    }
  }
}
```

Unfortunately it's not possible to add `env` on preset, so you need to add to each `.babelrc` when needed.
