import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StopPropagation from './StopPropagation'
import HeadPortal from './HeadPortal'
import extractHeadTags from './extractHeadTags'
import domNodeToReactNode from './domNodeToReactNode'
import { Provider } from './context'

const NODE_TYPE_ELEMENT_NODE = 1

function HeadProvider ({
  filters = [],
  filterHeadTags = tag => true,
  isClient = () => !!global.window,
  registry = [],
  ...props
}) {
  const [tags, setTags] = useState()

  if (
    isClient() &&
    !tags &&
    !registry.length &&
    global.window?.document?.head?.childNodes?.length
  ) {
    const nodes = [...global.window.document.head.childNodes]
      .filter(el => el.nodeType === NODE_TYPE_ELEMENT_NODE)
      .filter(filterHeadTags)

    registry.push(nodes.map(domNodeToReactNode))
    nodes.forEach(node => node.parentNode.removeChild(node))
  }

  function updateHead () {
    if (isClient()) {
      setTags(extractHeadTags(registry, filters))
    }
  }

  return (
    <>
      {isClient() && <HeadPortal>{tags}</HeadPortal>}
      <StopPropagation>
        <Provider value={{ registry, updateHead }} {...props} />
      </StopPropagation>
    </>
  )
}

HeadProvider.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.func),
  filterHeadTags: PropTypes.func,
  isClient: PropTypes.func,
  registry: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node))
}

export default HeadProvider
