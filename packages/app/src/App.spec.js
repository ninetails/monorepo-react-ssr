import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import { render } from 'react-testing-library'
import App from './App'

describe('App', function () {
  it('should render', () => {
    const { container } = render(<App />)
    expect(container.firstChild).toHaveTextContent('App')
  })
})
