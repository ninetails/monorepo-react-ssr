import * as React from 'react'
import { render } from 'react-testing-library'
import createRenderChunk from './createRenderChunk'

afterEach(jest.resetAllMocks)

describe('helpers/createRenderChunk', () => {
  it('should return a function by calling it', () => {
    expect(typeof createRenderChunk()).toBe('function')
  })

  describe('calling render function', () => {
    it('should return null without passing stats', () => {
      const mockFn = (chunkName: string, key: string | number): JSX.Element => (
        <p>foo</p>
      )

      const renderChunk = createRenderChunk()
      expect(renderChunk(mockFn)).toBeNull()
    })

    it('should return null passing empty stats ({})', () => {
      const mockFn = (chunkName: string, key: string | number): JSX.Element => (
        <p>foo</p>
      )

      const renderChunk = createRenderChunk({})
      expect(renderChunk(mockFn)).toBeNull()
    })

    it('should return null passing empty assetsByChunkName ({ assetsByChunkName: {} })', () => {
      const mockFn = (chunkName: string, key: string): JSX.Element => (
        <p>foo</p>
      )

      const renderChunk = createRenderChunk({ assetsByChunkName: {} })
      expect(renderChunk(mockFn)).toBeNull()
    })

    describe('passing (chunk => <p>{chunk}</p>) as fn', () => {
      let mockFn: jest.Mocked<(chunk: string, key: string) => JSX.Element>

      beforeEach(() => {
        mockFn = jest.fn((chunk: string, key: string) => (
          <p data-key={key}>{chunk}</p>
        ))
      })

      describe('passing ({ assetsByChunkName: "str" }) as stats', () => {
        let mockChunk = 'mock chunk'
        let mockStats = {
          assetsByChunkName: mockChunk
        }

        it('should call fn once', () => {
          const renderChunk = createRenderChunk(mockStats)
          render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          expect(mockFn).toHaveBeenCalledTimes(1)
          expect(mockFn).toHaveBeenNthCalledWith(1, mockChunk, mockChunk)
        })

        it('should render <p>str</p>', () => {
          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          const expected = `
<p
  data-key="${mockChunk}"
>
  ${mockChunk}
</p>
`

          expect(container.firstChild).toMatchInlineSnapshot(expected)
        })
      })

      describe('passing ({ assetsByChunkName: { foo: "bar" } }) as stats', () => {
        const mockChunk = 'mock chunk'
        const mockChunkName = 'mockmain'
        const mockStats = {
          assetsByChunkName: {
            [mockChunkName]: mockChunk
          }
        }

        it('should call fn once', () => {
          const renderChunk = createRenderChunk(mockStats)
          render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          expect(mockFn).toHaveBeenCalledTimes(1)
          expect(mockFn).toHaveBeenNthCalledWith(1, mockChunk, mockChunkName)
        })

        it('should render <p>bar</p>', () => {
          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          const expected = `
<p
  data-key="${mockChunkName}"
>
  ${mockChunk}
</p>
`

          expect(container.firstChild).toMatchInlineSnapshot(expected)
        })
      })
    })

    describe('passing (chunk => <p>{chunk === one ? "one" : "two"}</p>) as fn', () => {
      let mockFn: jest.Mocked<(chunk: string, key: string) => JSX.Element>
      const mockChunkOne = 'mock chunk 1'
      const mockChunkTwo = 'mock chunk 2'
      const mockReturnOne = 'foo1'
      const mockReturnTwo = 'foo2'

      beforeEach(() => {
        mockFn = jest.fn((chunk: string, key: string) => (
          <p data-key={key}>{chunk === mockChunkOne ? mockReturnOne : mockReturnTwo}</p>
        ))
      })

      describe('passing ({ assetsByChunkName: ["one", "two"] }) as stats', () => {
        const mockStats = {
          assetsByChunkName: [mockChunkOne, mockChunkTwo]
        }

        it('should call fn twice', () => {
          const renderChunk = createRenderChunk(mockStats)
          render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          expect(mockFn).toHaveBeenCalledTimes(2)
          expect(mockFn).toHaveBeenNthCalledWith(1, mockChunkOne, '0')
          expect(mockFn).toHaveBeenNthCalledWith(2, mockChunkTwo, '1')
        })

        it('should render <p>one</p><p>two</p>', () => {
          const expected = `
<div>
  <p
    data-key="0"
  >
    ${mockReturnOne}
  </p>
  <p
    data-key="1"
  >
    ${mockReturnTwo}
  </p>
</div>
`

          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          expect(container).toMatchInlineSnapshot(expected)
        })
      })
    })

    describe('passing ((chunk, name) => <p>{name}: {chunk}</p>) fn', () => {
      let mockFn: jest.Mocked<(chunk: string, key: string) => JSX.Element>

      beforeEach(() => {
        mockFn = jest.fn((chunk: string, key: string) => (
          <p data-key={key}>{chunk}</p>
        ))
      })

      describe('passing ({ one: "two", three: ["four", "five"] })', () => {
        const mockChunkOne = 'mock chunk 1'
        const mockChunkTwoOne = 'mock chunk 2-1'
        const mockChunkTwoTwo = 'mock chunk 2-1'
        const mockChunkNameOne = 'mockmainone'
        const mockChunkNameTwo = 'mockmaintwo'
        const mockStats = {
          assetsByChunkName: {
            [mockChunkNameOne]: mockChunkOne,
            [mockChunkNameTwo]: [mockChunkTwoOne, mockChunkTwoTwo]
          }
        }

        it('should call fn thrice', () => {
          const renderChunk = createRenderChunk(mockStats)
          render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          expect(mockFn).toHaveBeenCalledTimes(3)
          expect(mockFn).toHaveBeenNthCalledWith(1, mockChunkOne, mockChunkNameOne)
          expect(mockFn).toHaveBeenNthCalledWith(
            2,
            mockChunkTwoOne,
            `${mockChunkNameTwo}-0`
          )
          expect(mockFn).toHaveBeenNthCalledWith(
            3,
            mockChunkTwoTwo,
            `${mockChunkNameTwo}-1`
          )
        })

        it('should render <p>two</p><p>four</p><p>five</p>', () => {
          const expected = `
<div>
  <p
    data-key="${mockChunkNameOne}"
  >
    ${mockChunkOne}
  </p>
  <p
    data-key="${mockChunkNameTwo}-0"
  >
    ${mockChunkTwoOne}
  </p>
  <p
    data-key="${mockChunkNameTwo}-1"
  >
    ${mockChunkTwoTwo}
  </p>
</div>
`

          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          expect(container).toMatchInlineSnapshot(expected)
        })
      })
    })

    describe('options', () => {
      const mockStats = {
        assetsByChunkName: {
          main: ["path/to/main.hash.js", "path/to/main.hash.js.map"],
          vendors: ["path/to/vendors.hash.js", "path/to/vendors.hash.js.map"],
          styles: ["path/to/styles.hash.css", "path/to/styles.hash.css.map"]
        }
      }

      let mockFn: jest.Mocked<(chunk: string, key: string) => JSX.Element>

      beforeEach(() => {
        mockFn = jest.fn((chunk: string, key: string) => (
          <script src={chunk} data-key={key} />
        ))
      })

      describe('blacklist', () => {
        it('should ignore .map files by default', () => {
          const expected = `
<div>
  <script
    data-key="main-0"
    src="path/to/main.hash.js"
  />
  <script
    data-key="vendors-0"
    src="path/to/vendors.hash.js"
  />
  <script
    data-key="styles-0"
    src="path/to/styles.hash.css"
  />
</div>
`

          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn) as React.ComponentElement<{}, React.Component>)

          expect(container).toMatchInlineSnapshot(expected)
        })

        it('should ignore css file too if blacklist=/\.(css|map)$/', () => {
          const expected = `
<div>
  <script
    data-key="main-0"
    src="path/to/main.hash.js"
  />
  <script
    data-key="vendors-0"
    src="path/to/vendors.hash.js"
  />
</div>
`

          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn, { blacklist: /\.(css|map)$/ }) as React.ComponentElement<{}, React.Component>)

          expect(container).toMatchInlineSnapshot(expected)
        })
      })

      describe('whitelist', () => {
        it('should include only js files if whitelist=/\.js$/', () => {
          const expected = `
<div>
  <script
    data-key="main-0"
    src="path/to/main.hash.js"
  />
  <script
    data-key="vendors-0"
    src="path/to/vendors.hash.js"
  />
</div>
`

          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn, { whitelist: /\.js$/ }) as React.ComponentElement<{}, React.Component>)

          expect(container).toMatchInlineSnapshot(expected)
        })
      })

      describe('chunks', () => {
        it('should include only main if chunks=["main"]', () => {
          const expected = `
<div>
  <script
    data-key="main-0"
    src="path/to/main.hash.js"
  />
</div>
`

          const renderChunk = createRenderChunk(mockStats)
          const { container } = render(renderChunk(mockFn, { chunks: ['main'] }) as React.ComponentElement<{}, React.Component>)

          expect(container).toMatchInlineSnapshot(expected)
        })
      })
    })
  })
})
