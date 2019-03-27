// source: https://github.com/ReactTraining/react-router/issues/6430#issuecomment-434708844
import React, { createContext, memo, useContext } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

export const RouterContext = createContext({})

type RouterProps = {
  children: JSX.Element;
}

function Router({ children }: RouterProps) {
  return (
    <BrowserRouter>
      <Route>
        {props => (
          <RouterContext.Provider value={props}>
            {children}
          </RouterContext.Provider>
        )}
      </Route>
    </BrowserRouter>
  )
}

export function useRouter() {
  return useContext(RouterContext)
}

export default memo(Router)
