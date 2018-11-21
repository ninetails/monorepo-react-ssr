---
to: packages/<%= name %>/package.json
---
{
  "name": "<% if (locals.prefix) { -%><%= locals.prefix %><% } else { -%>@ninetails-monorepo-react-ssr/<% } -%><%= name %>",
  "version": "<% if (locals.version) { -%><%= locals.version %><% } else { -%>0.0.0<% } -%>",
  "private": true,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ninetails/monorepo-react-ssr.git"
  },
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/ninetails/monorepo-react-ssr/issues"
  },
  "homepage": "https://github.com/ninetails/monorepo-react-ssr/tree/master/packages/<%= name %>#readme",
  "devDependencies": {
    "@ninetails-monorepo-react-ssr/eslint-config-monorepo-ssr": "^0.0.0"
  },
  "scripts": {
    "lint": "eslint ."
  }
}
