import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

function HeadPortal ({ children, parent = global?.window?.document?.head }) {
  return createPortal(children, parent)
}

HeadPortal.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node)
}

export default HeadPortal
