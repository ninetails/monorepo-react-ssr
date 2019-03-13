// source: https://github.com/ReactTraining/react-router/issues/6430#issuecomment-434708844
import React, { createContext, memo, useContext } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route } from 'react-router-dom'

export const RouterContext = createContext({})

function Router ({ children }) {
  return (
    <BrowserRouter>
      <Route>
        {routeProps => (
          <RouterContext.Provider value={routeProps}>
            {children}
          </RouterContext.Provider>
        )}
      </Route>
    </BrowserRouter>
  )
}

Router.propTypes = {
  children: PropTypes.node
}

export function useRouter () {
  return useContext(RouterContext)
}

export default memo(Router)
