import React, { Fragment, Suspense } from 'react'
import Head from '@ninetails-monorepo-react-ssr/react-kabocha'
import { Link, Route, Switch } from 'react-router-dom'

const UniversalSuspense = global.window ? Suspense : Fragment

const test = {
  read (timeout, cache = global.window) {
    if (this.value) {
      if (cache) {
        return this.value
      }
      const output = this.value

      delete this.value
      delete this.promise

      return output
    }

    if (this.promise) {
      throw this.promise
    }

    this.promise = new Promise(resolve => {
      console.log('settimeout start', Date.now() / 1000)
      setTimeout(() => {
        console.log('settimeout end', Date.now() / 1000)
        this.value = 'foo'
        resolve(this.value)
      }, timeout)
    })

    throw this.promise
  }
}

function LazyTest () {
  const testValue = test.read(2000)
  return <div>{testValue}</div>
}

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
      <UniversalSuspense maxDuration={500} fallback={<div>loading...</div>}>
        <LazyTest />
      </UniversalSuspense>
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
