import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import logger from '@ninetails-monorepo-react-ssr/logger'

function Home () {
  logger.info('home')
  return <h1>Home</h1>
}

function About () {
  logger.info('about')
  return <h1>About</h1>
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
      </Switch>
    </div>
  )
}

export default App
