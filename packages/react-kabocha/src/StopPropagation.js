import { Component } from 'react'
import PropTypes from 'prop-types'

class StopPropagation extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { children } = this.props
    return children
  }
}

export default StopPropagation
