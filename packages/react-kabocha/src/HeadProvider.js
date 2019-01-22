import React, { useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import StopPropagation from './StopPropagation'
import HeadPortal from './HeadPortal'
import { createRegistry } from './Registry'
import domNodeToReactNode from './domNodeToReactNode'
import { Provider } from './context'

const NODE_TYPE_ELEMENT_NODE = 1

function noop () {
  return undefined
}

function HeadProvider ({
  filterHeadTags = tag => !['script', 'style'].includes(tag.tagName),
  isClient = () => !!global.window,
  registry = createRegistry(),
  ...props
}) {
  const [tags, setTags] = useState()

  const useLayoutEffectSSR = isClient()
    ? useLayoutEffect
    : noop

  useLayoutEffectSSR(() => {
    if (!tags) {
      const nodes = [...global.window.document.head.childNodes]
        .filter(el => el.nodeType === NODE_TYPE_ELEMENT_NODE)
        .filter(filterHeadTags)

      registry.add(nodes.map(domNodeToReactNode))
      nodes.forEach(node => node.parentNode.removeChild(node))
    }
  })

  function updateHead () {
    if (isClient()) {
      setTags(registry.head())
    }
  }

  return (
    <>
      {isClient() && <HeadPortal>{tags}</HeadPortal>}
      <StopPropagation>
        <Provider value={{ isClient, registry, updateHead }} {...props} />
      </StopPropagation>
    </>
  )
}

HeadProvider.propTypes = {
  filterHeadTags: PropTypes.func,
  isClient: PropTypes.func,
  registry: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node))
}

export default HeadProvider
