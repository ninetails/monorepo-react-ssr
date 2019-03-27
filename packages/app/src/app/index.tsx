import * as React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { Link, Route, Switch, RouteComponentProps } from 'react-router-dom'
import './config/hot-loader'

function Home() {
  return <h1>Home</h1>
}

function About() {
  return <h1>About</h1>
}

type StatusProps = {
  children: React.ReactNode;
  code: number;
}

function Status({ children, code }: StatusProps) {
  return (
    <Route
      render={({ staticContext }: RouteComponentProps) => {
        if (staticContext) {
          staticContext.statusCode = code
        }

        return children
      }}
    />
  )
}

Status.propTypes = {
  children: PropTypes.node,
  code: PropTypes.number
}

function NotFound() {
  return (
    <Status code={404}>
      <h1>404</h1>
    </Status>
  )
}

function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default hot(App)
