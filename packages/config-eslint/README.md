# @ninetails-monorepo-react-ssr/eslint-config-monorepo-ssr

This package contains eslint configuration using JavaScript Standard Style as rules, used for most packages on this monorepo.

You can simply use as creating a file named `.eslintrc` and putting:

```js
{
  "extends": ["@ninetails-monorepo-react-ssr/monorepo-ssr"]
}
```

And don't forget to add `"@ninetails-monorepo-react-ssr/eslint-config-monorepo-ssr": "*"` to `package.json`.

It also re-exports `eslint` command for `npm script` usage.
