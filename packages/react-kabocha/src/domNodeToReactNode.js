import { createElement } from 'react'

function domNodeToReactNode (node, index) {
  const tag = node.tagName.toLowerCase()
  const props = [...node.attributes].reduce(
    (acc, attr) => ({
      ...acc,
      [attr.name === 'charset' ? 'charSet' : attr.name]: attr.value
    }),
    {
      key: `initial-${index}`
    }
  )

  if (node.innerHTML) {
    props.dangerouslySetInnerHTML = {
      __html: node.innerHTML
    }
  }

  return createElement(tag, props)
}

export default domNodeToReactNode
