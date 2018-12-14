import { useContext, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import context from './context'

function noop () {
  return undefined
}

function Head ({ children }) {
  const { isClient, registry, updateHead } = useContext(context)
  const tags = children[Symbol.iterator] ? children : [children]

  const useLayoutEffectSSR = isClient()
    ? useLayoutEffect
    : noop

  registry.add(tags)

  useLayoutEffectSSR(function bindEffectHead () {
    updateHead()

    return function unbindEffectHead () {
      registry.remove(tags)

      updateHead()
    }
  })

  return null
}

Head.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default Head
