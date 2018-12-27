import React from 'react'
import PropTypes from 'prop-types'
import StopPropagation from './StopPropagation'
import Registry, { createRegistry } from './Registry'
import { Provider } from './context'

function HeadProvider ({ registry, ...props }) {
  const { useHeadInit, useHeadRegistry, RenderPortal } = registry || createRegistry(props)

  useHeadInit()

  return (
    <>
      <RenderPortal />
      <StopPropagation>
        <Provider {...props} value={{ useHeadRegistry }} />
      </StopPropagation>
    </>
  )
}

HeadProvider.propTypes = {
  registry: PropTypes.instanceOf(Registry)
}

export default HeadProvider
