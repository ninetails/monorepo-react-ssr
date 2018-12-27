import { useContext } from 'react'
import PropTypes from 'prop-types'
import context from './context'

export function useHead (tags) {
  const { useHeadRegistry } = useContext(context)
  useHeadRegistry(tags)
}

function Head ({ children }) {
  const tags = children[Symbol.iterator] ? children : [children]

  useHead(tags)

  return null
}

Head.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default Head
