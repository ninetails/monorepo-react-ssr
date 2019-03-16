import React from 'react'
import PropTypes from 'prop-types'
import { Link, Route, Switch } from 'react-router-dom'

function Home () {
  return <h1>Home</h1>
}

function About () {
  return <h1>About</h1>
}

function Status ({ children, code }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.status = code
        }

        return children
      }} />
  )
}

Status.propTypes = {
  children: PropTypes.node,
  code: PropTypes.number
}

function NotFound () {
  return (
    <Status code={404}>
      <h1>404</h1>
    </Status>
  )
}

function App () {
  return (
    <div>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
      </ul>

      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/about' component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default App
