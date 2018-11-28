# react-kabocha

## Basic Usage

### Head

#### Example

```js
import Head from 'react-kabocha'

function MyComponent(props) {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>My Title</title>
      </Head>
      ...stuff
    </>
  )
}
```

### HeadProvider

#### client

```js
ReactDOM.createRoot(root, { hydrate: root.hasChildNodes() }).render(
  <HeadProvider>
    <App />
  </HeadProvider>
)
```

#### server

```js
import { HeadProvider, extractHeadTags } from 'react-kabocha'

const registry = []

const content = renderToString(
  <HeadProvider registry={registry}>
    <App />
  </HeadProvider>
)

const head = extractHeadTags(registry)

const output = renderToStaticMarkup(
  <html>
    <head>{head}</head>
    <body>
      <div id='root' dangerouslySetInnerHTML={{ __html: content }} />
    </body>
  </html>
)
```

## Advanced API

### Head

```js
import Head from 'react-kabocha'
```

#### Props

##### children [type: ReactElement | Array&lt;ReactElement&gt;]

Elements to be rendered on `<head>`.

### HeadProvider

```js
import { HeadProvider } from 'react-kabocha'
```

#### Props

##### filters [type: Array&lt;function&gt;]defaults: [] ]

You can pass additional filters for filtering tags before render. It will run over a reversed array of tags. Their arguments are the same of `Array.prototype.filter`, also what it returns (a boolean).

##### filterHeadTags [type: function][defaults: tag => true]

It filter tags on first client side render, when removes actual head tag and adds to registry stack.

##### isClient [type: function][defaults: () => !!window]

Just a function that return true when code is running on Browser. If you set window as global on your server, you should change this as well.

##### registry [type: Array&lt;Array&lt;ReactElement&gt;&gt;]defaults: [] ]

Registry of entries used by library. On server rendering you need to pass this argument to recover collected tags.

### extractHeadTags

```js
import { extractHeadTags } from 'react-kabocha'
```

#### args

##### registry [type: Array&lt;Array&lt;ReactElement&gt;&gt;][required]

Previously defined before calling any `renderTo*` function from `react-dom`.

##### additionalFilters [type: Array&lt;function&gt;][optional]

You can pass additional filters. The default ones you can get on `extractHeadTags.filters`:

- **filterTitle** will render only the first `<title>` tag on a list of reversed tags
- **filterCharSet** ensure that theres only one `<meta charSet='value'>`
- **filterViewport** will print only one `<meta name="viewport">`

Additional filters will be executed after three above and from last tag to first. Be advised that order can be messed on cases that concurrent rendering calls different `<Head>` at same time.

The order of tags also will be reversed when filtering to priorize later defined tags (but reversed again before render on head).

Example: calling

```js
function Inside () {
  return (
    <>
      <Head>
        <title>Bar</title>
      </Head>
    <>
  )
}

function Outside () {
  return (
    <>
      <Head>
        <title>Foo</title>
      </Head>
      <Inside />
    <>
  )
}

ReactDOM.render(<Outside />, ...)
```

Will result on rendering `<title>Bar</title>`. It is useful when using a title for each Route and you can set a fallback outside Router.

Default filters are passed as optional third argument to **extractHeadTags**. Override only if needed.

## FAQ

### Shows `TypeError: Cannot read property 'registry' of null`

Did you forgot to call `<HeadProvider>` somewhere in your App?

### Writing styles

You can escape curly braces writing as string

```js
<Head>
  {`
    body { background: gray; }
  `}
</Head>
```

But it is still preferable to use some third party library for that and not using **react-kabaocha** for that.
