import React from 'react'
import Head from '@ninetails-monorepo-react-ssr/react-kabocha'
import { Link, Route, Switch } from 'react-router-dom'

function Home () {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      Home
    </div>
  )
}

function About () {
  return (
    <div>
      <Head>
        <title>About</title>
      </Head>
      About
    </div>
  )
}

const App = () => (
  <div>
    <Head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Head>
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

export default App
