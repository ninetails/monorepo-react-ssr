import React from 'react'
import { Meta, Title } from 'react-head'
import { Link, Route, Switch } from 'react-router-dom'

function Home () {
  return (
    <div>
      <Title>Home</Title>
      Home
    </div>
  )
}

function About () {
  return (
    <div>
      <Title>About</Title>
      About
    </div>
  )
}

export default () => (
  <div>
    <Meta charSet='utf-8' />
    <Meta name='viewport' content='width=device-width, initial-scale=1' />
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
      </ul>
    </nav>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/about' component={About} />
    </Switch>
  </div>
)
