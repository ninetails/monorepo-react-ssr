import { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import context from './context'

function Head ({ children }) {
  const { registry, updateHead } = useContext(context)
  const tags = children[Symbol.iterator] ? children : [children]

  registry.push(tags)

  useEffect(function bindEffectHead () {
    updateHead()

    return function unbindEffectHead () {
      const index = registry.indexOf(tags)

      if (index > -1) {
        registry.splice(index, 1)
      }

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
